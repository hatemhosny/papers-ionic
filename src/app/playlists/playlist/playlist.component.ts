import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../core/notification/notification.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  items = [1, 2, 3, 4, 5];
  sortablejsOptions = {
        // handle: '.drag-handle',
        // draggable: '.collection-item',
        animation: 150
  };

  constructor(private notification: NotificationService) { }

  ngOnInit() {
  }

  savePlaylist() {
    this.notification.message('Playlist saved!');
  }
  successPlaylist() {
    this.notification.success('Playlist saved!');
  }
  infoPlaylist() {
    this.notification.info('Playlist saved!');
  }
  warningPlaylist() {
    this.notification.warning('Playlist saved!');
  }
  errorPlaylist() {
    this.notification.error('Playlist saved!');
  }
}
