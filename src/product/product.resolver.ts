import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { MovementProductInput } from './dto/movement-product.input';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation('createProduct')
  create(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Query('products')
  findAll() {
    return this.productService.findAll();
  }

  @Query('product')
  findOne(@Args('id') id: number) {
    return this.productService.findOne(id);
  }

  @Mutation('movementProduct')
  movementProduct(
    @Args('movementProductInput') movementProductInput: MovementProductInput,
  ) {
    return this.productService.movementProduct(movementProductInput);
  }
}
