// domain.dto.ts
import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateDomainDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  statusCode: number;

  @IsNotEmpty()
  speed: number;

  @IsNotEmpty()
  date: number;
}
