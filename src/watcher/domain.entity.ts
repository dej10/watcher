import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  statusCode: number;

  @Column()
  speed: number;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // checkedAt: string;
}
