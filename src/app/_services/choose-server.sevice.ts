import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ChooseServerService {

    public server$: Subject<string> = new Subject<string>();
}
