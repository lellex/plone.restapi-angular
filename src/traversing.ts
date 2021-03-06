import { OnInit, OnDestroy } from '@angular/core';
import { Target } from 'angular-traversal';
import { Services } from './services';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

export abstract class TraversingComponent implements OnInit, OnDestroy {

  context: any;
  ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public services: Services,
  ) { }

  ngOnInit() {
    this.services.traverser.target
      .takeUntil(this.ngUnsubscribe)
      .subscribe((target: Target) => {
        this.context = target.context;
        window.scrollTo(0, 0);
        this.onTraverse(target);
      });
  }

  onTraverse(target: Target) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
