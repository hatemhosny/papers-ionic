import { NgModule } from '@angular/core';
import { Router, Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bookmarks', loadChildren: './bookmarks/bookmarks.module#BookmarksModule' }, // lazy loaded
  { path: 'playlists', loadChildren: './playlists/playlists.module#PlaylistsModule' }, // lazy loaded
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})]
})
export class AppRoutingModule {
    constructor(private router: Router) {
    router.events.subscribe((val) => {
      window.scrollTo(0, 0);
    });
  }
}
