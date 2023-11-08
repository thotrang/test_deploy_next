import type { ManifestParsedData } from 'hls.js';
import Hls from 'hls.js';
import Plyr from 'plyr';

const settingControls = [
  'play-large', // Nút play lớn ở giữa
  // 'restart', // Nút phát lại
  'rewind', // Tua lại (mặc định 10 giây)
  'play', // Nút Phát/Tạm dừng
  'fast-forward', // Tua nhanh (mặc định 10 giây)
  'progress', // Thanh tiến trình và thanh trượt để phát lại
  'current-time', // Thời gian hiện tại
  'duration', // Toàn bộ thời gian của video
  'mute', // Bật tắt âm thanh
  'volume', // Điều khiển âm lượng
  // 'captions', // Chuyển đổi phụ đề
  'settings', // Menu cài đặt
  // 'pip', // Chế độ hình trong hình (hiện chỉ hỗ trợ trình duyệt Safari)
  'airplay', // Airplay (hiện chỉ hỗ trợ trình duyệt Safari)
  // 'download', // Hiển thị nút tải xuống với liên kết đến nguồn hiện tại
  'fullscreen', // Nút phóng to toàn màn hình
];

function updateQuality(newQuality: number) {
  if (newQuality === 0) {
    (window as any).hls.currentLevel = -1;
  } else {
    (window as any).hls.levels.forEach((level: any, levelIndex: number) => {
      if (level.height === newQuality) {
        (window as any).hls.currentLevel = levelIndex;
      }
    });
  }
}

const settingVideoHls = ({
  hls,
  data,
  elementVideo,
}: {
  hls: Hls;
  data: ManifestParsedData;
  elementVideo: HTMLVideoElement;
}) => {
  const defaultOptions: Plyr.Options = {};
  const availableQualities = data.levels.map((l) => l.height);
  availableQualities.unshift(0);

  defaultOptions.quality = {
    default: availableQualities.length - 1,
    options: availableQualities,
    forced: true,
    onChange: (quality: number) => updateQuality(quality),
  };

  defaultOptions.i18n = {
    qualityLabel: {
      0: 'Auto',
    },
  };

  // setting controls option
  defaultOptions.controls = settingControls;

  hls.on(Hls.Events.LEVEL_SWITCHING, () => {
    defaultOptions.autopause = true;
  });

  hls.on(Hls.Events.LEVEL_SWITCHED, () => {
    const span = document.querySelector(
      ".plyr__menu__container [data-plyr='quality'][value='0'] span"
    );
    if (span) span.innerHTML = `Auto`;
  });

  const player = new Plyr(elementVideo, defaultOptions);
  return player;
};

export { settingControls, settingVideoHls };
