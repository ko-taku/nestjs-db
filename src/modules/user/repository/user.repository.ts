import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../common/db/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { error } from 'console';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findOne(options): Promise<User | undefined> {
    // Todo: findOne은 어떤 조건이 들어올지 몰라도 where절에 options를 통해 데이터를 조회해야 합니다.

    const user = await this.userRepository.findOne({ where: options });
    //await 없이 쓰면 Promise 자체를 다루게 되어 타입 충돌
    //await를 쓰면 실제값을 꺼내서 처리
    return user ?? undefined;
  }

  async findAll(): Promise<User[]> {
    // Todo: findAll은 전체 데이터를 조회해야 합니다.
    const result = await this.userRepository.find();
    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Todo: create은 유저 데이터를 생성해야 합니다.
    const newUser = this.userRepository.create({ ...createUserDto });
    //명시적으로 객체 펼쳐서 안전하게 복사, createUserDto 객체의 모든 키-값을 펼쳐서 create()의 인자로 넘겨준다

    return this.userRepository.save(newUser);
  }

  async countAll(): Promise<number> {
    // Todo: countAll은 전체 데이터의 개수를 조회해야 합니다.
    return this.userRepository.count();
  }

  async existsByUserId(userId: string): Promise<boolean> {
    // Todo: existsByUserId은 userId로 유저의 정보가 있는지 확인해야 합니다. 리턴은 boolean으로 해주세요.

    // 방법 1 (Count)
    const count = await this.userRepository.count({
      where: { userId: userId },
    });

    return count > 0;

    // return await this.userRepository.exists({ where: { userId } });
  }

  async update(
    userId: string,
    updateUserDto: Partial<CreateUserDto>
  ): Promise<User> {
    // Todo: update은 userId로 유저의 정보를 수정해야 합니다.

    //merge는 기존 엔티티 객체와 변경 데이터를 병합해서 새 엔티티 객체를 만든다
    //엔티티 객체를 생성/갱신하는 과정이 있다
    //엔티티 라이프사이클 훅들(@BeforeUpdate, @AfterUpdate 등)이 호출된다
    //복잡한 비즈니스 로직이 필요한 경우, 유효성 검사 등을 엔티티 단에서 처리 가능
    // 방법 1(Merge)
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);

    // const olduser = await this.findOne({ where: { userId } });
    // if (!olduser) {
    //   throw new Error('User not found');
    // }

    // await this.userRepository.update(olduser.id, {
    //   email: updateUserDto.email,
    // });

    // const updatedUser = await this.findOne({ userId, });
    // if (!updatedUser) {
    //   throw new Error('User not found');
    // }

    // return updatedUser;
  }

  async delete(userId: string): Promise<void> {
    // Todo: delete은 userId로 유저의 정보를 삭제해야 합니다.
    await this.userRepository.delete({ userId });
  }
}
