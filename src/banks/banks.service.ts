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

  async create(userId: number, createBankDto: CreateBankDto) {
    createBankDto.user = userId;
    return this.banksRepository.save(createBankDto);
  }

  async update(bankId: number, updateBankDto: UpdateBankDto) {
    return this.banksRepository.update({ id: bankId }, updateBankDto);
  }

  async findOne(bankId: number) {
    return this.banksRepository.findOneBy({ id: bankId });
  }

  async findAll(userId: number) {
    return this.banksRepository.findBy({ user: userId });
  }

  async delete(bankId: number) {
    return this.banksRepository.delete({ id: bankId });
  }

  async incrementBalance(bankId: number, value: number) {
    return this.banksRepository.increment({ id: bankId }, 'balance', value);
  }

  async decrementBalance(bankId: number, value: number) {
    return this.banksRepository.decrement({ id: bankId }, 'balance', value);
  }
}
