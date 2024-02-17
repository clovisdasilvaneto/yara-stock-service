import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { IsNull, Repository } from 'typeorm';
import { MovementProductInput } from './dto/movement-product.input';
import {
  EProductAction,
  WarehouseHistory,
} from 'src/warehouse/entities/warehouseHistory.entity';
import { NotFoundError } from 'rxjs';
import { WarehouseProduct } from 'src/warehouse/entities/warehouseProduct.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseHistory)
    private readonly warehouseHistoryRepository: Repository<WarehouseHistory>,
    @InjectRepository(WarehouseProduct)
    private readonly warehouseProductRepository: Repository<WarehouseProduct>,
  ) {}

  async create(createProductInput: CreateProductInput) {
    const product = this.productRepository.create(createProductInput);

    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: { id },
    });
  }

  // TODO: use transactions for this method in order to avoid
  // racing conditions problem
  async movementProduct(movementProductInput: MovementProductInput) {
    const action = movementProductInput.action;
    const product = await this.productRepository.findOne({
      where: { id: movementProductInput.productId || IsNull() },
    });
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: movementProductInput.warehouseId || IsNull() },
    });

    if (!warehouse || !product) {
      throw new NotFoundError('warehouse or product not found');
    }

    try {
      if (action === EProductAction.IMPORT) {
        await this.importProduct(movementProductInput, warehouse, product);
      } else {
        await this.exportProduct(movementProductInput);
      }

      const warehouseHistory = new WarehouseHistory();
      warehouseHistory.action = movementProductInput.action;
      warehouseHistory.amount = movementProductInput.amount;
      warehouseHistory.date = movementProductInput.date;
      warehouseHistory.product = product;
      warehouseHistory.warehouse = warehouse;

      return this.warehouseHistoryRepository.save(warehouseHistory);
    } catch (err) {
      throw err;
    }
  }

  async importProduct(
    movementProductInput: MovementProductInput,
    warehouse: Warehouse,
    product: Product,
  ) {
    const productsWarehouse = await this.warehouseProductRepository.find({
      where: {
        warehouse: { id: movementProductInput.warehouseId || IsNull() },
      },
      relations: ['product'],
    });

    if (
      productsWarehouse?.length &&
      productsWarehouse[0].product.isHazardous !== product.isHazardous
    ) {
      throw new Error(
        'The desired warehouse can either contain only hazardous products or only non-hazardous products',
      );
    }

    const currentAmount = productsWarehouse.reduce(
      (acc, current) => (acc += current.amount),
      0,
    );

    if (currentAmount + movementProductInput.amount > warehouse.maxAmount) {
      throw new Error(
        'the desired amount exceed the max amount allowed on your warehouse',
      );
    }

    if (product.amount < movementProductInput.amount) {
      throw new Error('The provided amount exceed your current product amount');
    }

    const warehouseProduct = await this.warehouseProductRepository.findOne({
      where: {
        product: { id: movementProductInput.productId || IsNull() },
        warehouse: { id: movementProductInput.warehouseId || IsNull() },
      },
    });

    if (warehouseProduct) {
      warehouseProduct.amount += movementProductInput.amount;

      await this.warehouseProductRepository.save(warehouseProduct);
    } else {
      const newWarehouseProduct = this.warehouseProductRepository.create({
        amount: movementProductInput.amount,
        product,
        warehouse,
      });

      await this.warehouseProductRepository.save(newWarehouseProduct);
    }

    product.amount -= movementProductInput.amount;

    this.productRepository.save(product);
  }

  async exportProduct(movementProductInput: MovementProductInput) {
    const productsWarehouse = await this.warehouseProductRepository.findOne({
      where: {
        product: { id: movementProductInput.productId || IsNull() },
        warehouse: { id: movementProductInput.warehouseId || IsNull() },
      },
    });

    if (!productsWarehouse) {
      throw new Error('The provided product is not in the warehouse');
    }

    if (movementProductInput.amount > productsWarehouse.amount) {
      throw new Error(
        'The provided amount exceed your current product amount in the warehouse',
      );
    }

    if (movementProductInput.amount === productsWarehouse.amount) {
      await this.warehouseProductRepository.remove(productsWarehouse);
    } else {
      productsWarehouse.amount -= movementProductInput.amount;
      await this.warehouseProductRepository.save(productsWarehouse);
    }
  }
}
