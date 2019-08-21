import { Component, ViewChild } from '@angular/core';
import { PostsService } from './services/posts.service';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('search') searchBox:SearchboxComponent;
  // public posts;
  public posts$;
  // public postsSubscription;
  constructor(private postsService:PostsService){}

  ngOnInit() {
    this.posts$ = this.searchBox.value
      .pipe( switchMap(val => this.postsService.search(val)));

      // this.postsSubscription = this.posts$.subscribe(data => this.posts = data);
  }


  // ngOnDestroy(): void {
  //   this.postsSubscription.unsubscribe();
  // }
}
