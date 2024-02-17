import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseInput: CreateWarehouseInput) {
    const warehouse = this.warehouseRepository.create(createWarehouseInput);

    return await this.warehouseRepository.save(warehouse);
  }

  async findAll() {
    return await this.warehouseRepository.find();
  }

  async findOne(id: number) {
    return await this.warehouseRepository.findOne({
      where: { id },
      relations: [
        'warehouseHistory',
        'warehouseHistory.product',
        'warehouseProduct',
        'warehouseProduct.product',
      ],
    });
  }

  async update(id: number, updateWarehouseInput: UpdateWarehouseInput) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) throw new NotFoundException();

    Object.assign(warehouse, updateWarehouseInput);

    await this.warehouseRepository.save(warehouse);
  }

  async remove(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) throw new NotFoundException();

    await this.warehouseRepository.remove(warehouse);
  }
}
