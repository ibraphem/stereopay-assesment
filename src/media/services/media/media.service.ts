import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/typeorm/entities/media';
import { createMediaParams, updateMediaParams } from 'src/utils/types';
import { Repository } from 'typeorm';


@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  fetchMedia(page: number, perPage: number) {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return this.mediaRepository.find({
      skip: start,
      take: perPage,
    });
  }

  createMedia(mediaDetails: createMediaParams) {
    const newMedia = this.mediaRepository.create(mediaDetails);
    return this.mediaRepository.save(newMedia);
  }

  async fetchMediaById(id: number) {
    let media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media
  }

  async search(query: string) {
    const result = await this.mediaRepository
      .createQueryBuilder('media')
      .where('media.name LIKE :query OR media.description LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();

    return result;
  }

  async updateMedia(id: number, updateMediaDetail: updateMediaParams) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
  
    }
    await this.mediaRepository.update({ id }, { ...updateMediaDetail })  
    const updatedMedia = await this.mediaRepository.findOneBy({id})

    return updatedMedia;   
    
  }

  async softDelete(id: number) {
    const media = await this.mediaRepository.findOneBy({ id });
  
    
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    media.deletedAt = new Date();
    await this.mediaRepository.save(media);
  }


}
