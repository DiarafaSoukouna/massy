import {Injectable} from '@angular/core';
import {Task} from '../models/task';
import {HttpClient} from '@angular/common/http';
import {HandleError} from './service-helper';

@Injectable()
export class TaskService {
	private taskUrl = 'api/tasks';

	constructor(private http: HttpClient) {}

	get(): Promise<Task[]>{
		return this.http.get(this.taskUrl)
			.toPromise()
			.catch(HandleError);
	}
}
