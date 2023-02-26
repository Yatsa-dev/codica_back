import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create.dto';
import { UpdateBankDto } from './dto/update.dto';
import { Bank } from './entity/bank.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank) private banksRepository: Repository<Bank>,
  ) {}

  async create(userId: number, createBankDto: CreateBankDto): Promise<Bank> {
    createBankDto.user = userId;
    return this.banksRepository.save(createBankDto);
  }

  async update(
    bankId: number,
    updateBankDto: UpdateBankDto,
  ): Promise<{ success: boolean }> {
    await this.banksRepository.update({ id: bankId }, updateBankDto);

    return { success: true };
  }

  async findOne(bankId: number): Promise<Bank> {
    return this.banksRepository.findOneBy({ id: bankId });
  }

  async findAll(userId: number): Promise<Bank[]> {
    return this.banksRepository.findBy({ user: userId });
  }

  async delete(bankId: number): Promise<{ success: boolean }> {
    await this.banksRepository.delete({ id: bankId });

    return { success: true };
  }

  async incrementBalance(
    bankId: number,
    value: number,
  ): Promise<{ success: boolean }> {
    await this.banksRepository.increment({ id: bankId }, 'balance', value);

    return { success: true };
  }

  async decrementBalance(
    bankId: number,
    value: number,
  ): Promise<{ success: boolean }> {
    await this.banksRepository.decrement({ id: bankId }, 'balance', value);

    return { success: true };
  }
}
