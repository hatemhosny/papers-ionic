import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';

import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
     { path: '', component: PlaylistsComponent },
     { path: ':id', component: PlaylistComponent }
    ])
  ],
  declarations: [PlaylistsComponent, PlaylistComponent]
})
export class PlaylistsModule { }
