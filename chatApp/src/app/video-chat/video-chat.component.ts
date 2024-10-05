import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Peer from 'peerjs';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
})
export class VideoChatComponent implements OnInit {
  peer: Peer;
  localStream: MediaStream;
  roomName;
  peers: any = {}; // To store connected peers

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.roomName = params.get('roomName');
      console.log(this.roomName);
    });
    // // Initialize PeerJS
    // this.peer = new Peer();

    // // Get the local video and audio stream
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     this.localStream = stream;

    //     // Display the local video
    //     const localVideo = document.getElementById(
    //       'local-video'
    //     ) as HTMLVideoElement;
    //     localVideo.srcObject = stream;
    //     localVideo.play();

    //     // Handle incoming calls from other peers
    //     this.peer.on('call', (call) => {
    //       call.answer(this.localStream); // Answer with the local stream

    //       // When receiving the remote stream, display it
    //       call.on('stream', (remoteStream) => {
    //         this.addRemoteStream(call.peer, remoteStream); // Show remote video
    //       });
    //     });

    //     // Get the peer ID once the connection is established
    //     this.peer.on('open', (id) => {
    //       console.log('Your peer ID is:', id);
    //       // Logic to notify other users of your presence can be added here (via Socket.io or other signaling)
    //     });
    //   });
  }

  // Call multiple peers when joining a group
  // callPeers(peerIds: string[]) {
  //   peerIds.forEach((peerId) => {
  //     if (!this.peers[peerId]) {
  //       // Prevent duplicate connections
  //       const call = this.peer.call(peerId, this.localStream); // Call other peer with local stream

  //       // When the call is connected, display the remote stream
  //       call.on('stream', (remoteStream) => {
  //         this.addRemoteStream(peerId, remoteStream);
  //       });

  //       // Store the connection to avoid calling the same peer again
  //       this.peers[peerId] = call;
  //     }
  //   });
  // }

  // // Add remote stream to the HTML by creating a new video element
  // addRemoteStream(peerId: string, remoteStream: MediaStream) {
  //   const videoContainer = document.getElementById('videos');
  //   let remoteVideo = document.getElementById(
  //     `remote-video-${peerId}`
  //   ) as HTMLVideoElement;

  //   // Check if video element already exists
  //   if (!remoteVideo) {
  //     remoteVideo = document.createElement('video');
  //     remoteVideo.setAttribute('id', `remote-video-${peerId}`);
  //     remoteVideo.autoplay = true;
  //     videoContainer.appendChild(remoteVideo); // Append new video element for the remote peer
  //   }

  //   // Set the source for the remote video stream and play
  //   remoteVideo.srcObject = remoteStream;
  //   remoteVideo.play();
  // }

  // // Call this function when someone leaves the video call
  // removePeerVideo(peerId: string) {
  //   const videoElement = document.getElementById(`remote-video-${peerId}`);
  //   if (videoElement) {
  //     videoElement.remove(); // Remove the video element when the peer leaves
  //   }

  //   // Also clean up the peer connection
  //   if (this.peers[peerId]) {
  //     this.peers[peerId].close(); // Close the connection
  //     delete this.peers[peerId]; // Remove from the list of active peers
  //   }
  // }
}
