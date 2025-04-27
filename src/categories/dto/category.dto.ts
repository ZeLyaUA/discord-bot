// src/categories/dto/category.dto.ts
export class CreateCategoryDto {
  name: string;
  position?: number;
}

export class ChannelDto {
  id: string;
  name: string;
  type: string;
}

export class CategoryDto {
  id: string;
  name: string;
  position: number;
  channels: ChannelDto[];
}
