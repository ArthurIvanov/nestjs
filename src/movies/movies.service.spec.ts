import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
	let service: MoviesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MoviesService],
		}).compile();

		service = module.get<MoviesService>(MoviesService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getAll', () => {
		it('should retuatn an array', () => {
			const result = service.getAll();

			expect(result).toBeInstanceOf(Array);
		});
	});

	describe('getOne', () => {
		it('should return a movie', () => {
			service.create({
				title: 'Test movie',
				year: 2021,
				genres: ['horror', 'drama'],
			});
			const movie = service.getOne(1);
			expect(movie).toBeDefined();
			expect(movie.id).toEqual(1);
		});
		it('should throw 404 error', () => {
			try {
				service.getOne(9999);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.message).toEqual(`Movie with ID: 9999 not found.`);
			}
		});
	});

	describe('deleteOne', () => {
		it('delete a movie', () => {
			service.create({
				title: 'Test movie',
				year: 2021,
				genres: ['horror', 'drama'],
			});
			const beforeDelte = service.getAll().length;
			service.deleteOne(1);
			const afterDelete = service.getAll().length;
			expect(afterDelete).toBeLessThan(beforeDelte);
		});
		it('should return 404', () => {
			try {
				service.deleteOne(9999);
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.message).toEqual(`Movie with ID: 9999 not found.`);
			}
		});
	});

	describe('create', () => {
		it('should create a movie', () => {
			const beforeCreate = service.getAll().length;

			service.create({
				title: 'Test movie',
				year: 2021,
				genres: ['horror', 'drama'],
			});

			const afterCreate = service.getAll().length;

			expect(beforeCreate).toBeLessThan(afterCreate);
		});
	});

	describe('udate', () => {
		it('should update a movie', () => {
			service.create({
				title: 'Test movie',
				year: 2021,
				genres: ['horror', 'drama'],
			});

			service.update(1, { title: 'Updated title' });
			const movie = service.getOne(1);
			expect(movie.title).toEqual('Updated title');
		});

		it('should return 404', () => {
			try {
				service.update(999, { title: 'Updated title' });
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException);
				expect(e.message).toEqual(`Movie with ID: 999 not found.`);
			}
		});
	});
});
