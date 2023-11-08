import classNames from 'classnames';
import Hls from 'hls.js';
import type { PlyrEvent } from 'plyr';
import Plyr from 'plyr';
import React, { useEffect } from 'react';

import { settingVideoHls } from '../helper/plyr-setting';
export interface BaseVideoHlsProps {
  className?: string;
  onLoadeddata?: (player: Plyr, e: PlyrEvent) => void;
  onTimeUpate?: (player: Plyr, e: PlyrEvent) => void;
  onSeeking?: (player: Plyr, e: PlyrEvent) => void;
  onSeeked?: (player: Plyr, e: PlyrEvent) => void;
  onEnded?: (player: Plyr, e: PlyrEvent) => void;
}

const BaseVideoHLS = (props: BaseVideoHlsProps) => {
  let loadsourse = true;
  let player: Plyr;
  const setPlayer = (newPlayer: Plyr, root: ShadowRoot) => {
    player = newPlayer;
    player.volume = 1;
    player.on('loadeddata', (e) => {
      if (props.onLoadeddata) props.onLoadeddata(player, e);
    });
    player.on('timeupdate', (e) => {
      if (props.onTimeUpate) props.onTimeUpate(player, e);
    });
    player.on('seeking', (e) => {
      if (props.onSeeking) props.onSeeking(player, e);
    });
    player.on('seeked', (e) => {
      if (props.onSeeked) props.onSeeked(player, e);
    });
    player.on('ended', (e) => {
      if (props.onEnded) props.onEnded(player, e);
    });

    // đổi link của icon sang dùng icon trên local
    const elementUse = root.querySelectorAll('use[*|href]');
    for (const element of elementUse) {
      const attribute = element.getAttribute('href');

      if (attribute && attribute.indexOf('#') === 0) {
        element.setAttribute(
          'href',
          `/icon-plyr.svg${element.getAttribute('href')}`
        );
      }
    }
  };
  const setupVideoHls = () => {
    const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
    let root: ShadowRoot;

    if (mainVideo.shadowRoot) {
      mainVideo.shadowRoot.innerHTML = '';
      root = mainVideo.shadowRoot;
    } else root = mainVideo.attachShadow({ mode: 'open' });
      const videoWrap = document.createElement('div');
      videoWrap.setAttribute('style', ` width: 100%; height: 100%;`);
      const style = document.createElement('style');
      style.innerHTML = `
        .plyr {height: 100%; width: 100%;}
         @media only screen and (max-width: 600px) {
            .plyr__volume input[type=range] {
              display: none;
            }
          }
      `;
      const elementVideo = document.createElement('video');
      elementVideo.setAttribute('controls', 'playsInline full');
      elementVideo.setAttribute('preload', 'none');
      elementVideo.setAttribute('style', 'aspect-ratio: 16 / 8;');

      const head = document.createElement('head');
      head.innerHTML = `<link href="https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.css" rel="stylesheet" />`;
      head.innerHTML += `<script href="https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.min.js" />`;

      videoWrap.appendChild(head);
      videoWrap.appendChild(elementVideo);
      videoWrap.appendChild(style);
      root.appendChild(videoWrap);
      // setup video
      const source = 'https://256166744.e.cdneverest.net/izteach/test/23b0bfb0-c00b-11e9-a060-17d3861b7a5b/videos/6437bec94bee890008e38221/playlist_drm.m3u8';
      const defaultOptions: Plyr.Options = {};

      if (!Hls.isSupported()) {
        elementVideo.src = source;
        setPlayer(new Plyr(elementVideo, defaultOptions), root);
      } else {
        const hls = new Hls();
        hls.loadSource(source);
        loadsourse = true;
        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          mainVideo.classList.add('!visible');
          loadsourse = false;
          setPlayer(settingVideoHls({ hls, data, elementVideo }), root);
        });

        hls.attachMedia(elementVideo);
        (window as any).hls = hls;
      }
  };

  useEffect(() => {
    setupVideoHls();
  });
  return (
    <div
      className={classNames(
        `container_plyr transition-all duration-300 h-full w-full`,
        props.className,
        {
          invisible: loadsourse,
          visible: !loadsourse,
        }
      )}
      id="main-video"
    />
  );
};

export default BaseVideoHLS;
