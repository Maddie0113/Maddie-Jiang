'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type ProjectKey = 'bound-pie' | 'dong' | 'ai-platform';
type PanelKey = ProjectKey | 'bound-pie-detail' | 'dong-detail' | 'ai-platform-detail' | 'about' | 'contact' | 'camera' | null;
type DetailMotionPart = { left: number; top: number; width: number; height: number; delay: number; radius?: number };

const aiMotionPresets: Record<number, { className: string; parts: DetailMotionPart[] }> = {
  2: {
    className: 'ai-rows-motion',
    parts: [
      { left: 4, top: 24, width: 92, height: 13, delay: 80, radius: 10 },
      { left: 4, top: 38.5, width: 92, height: 13, delay: 220, radius: 10 },
      { left: 4, top: 53, width: 92, height: 14, delay: 360, radius: 10 },
    ],
  },
  6: {
    className: 'ai-path-motion',
    parts: [
      { left: 3.2, top: 24.5, width: 65.5, height: 74.5, delay: 80, radius: 20 },
      { left: 64.4, top: 58, width: 30.6, height: 37, delay: 360, radius: 18 },
    ],
  },
  7: {
    className: 'ai-course-content-motion',
    parts: [
      { left: 39.4, top: 36.7, width: 58.3, height: 58.7, delay: 100, radius: 18 },
      { left: 76.5, top: 14.8, width: 21.2, height: 20.2, delay: 360, radius: 14 },
    ],
  },
  8: {
    className: 'ai-project-setup-motion',
    parts: [
      { left: 38.1, top: 17.8, width: 57.5, height: 76.5, delay: 80, radius: 18 },
      { left: 7.3, top: 56.5, width: 30.5, height: 16.2, delay: 300, radius: 10 },
      { left: 7.3, top: 75.2, width: 30.5, height: 17.5, delay: 460, radius: 10 },
    ],
  },
  9: {
    className: 'ai-modules-motion',
    parts: [
      { left: 13, top: 29.5, width: 55.7, height: 30, delay: 100, radius: 18 },
      { left: 61.8, top: 61.8, width: 33, height: 34, delay: 340, radius: 18 },
    ],
  },
  10: {
    className: 'ai-course-list-motion',
    parts: [
      { left: 43.2, top: 6, width: 54.2, height: 90.3, delay: 80, radius: 18 },
      { left: 3.9, top: 42.3, width: 39.8, height: 12.4, delay: 320, radius: 10 },
      { left: 3.9, top: 57.6, width: 39.8, height: 16.5, delay: 470, radius: 10 },
    ],
  },
  11: {
    className: 'ai-moodboard-motion',
    parts: [
      { left: 52, top: 9.5, width: 18.5, height: 40, delay: 80, radius: 16 },
      { left: 52, top: 50.4, width: 18.5, height: 40, delay: 230, radius: 16 },
      { left: 71.1, top: 9.5, width: 24, height: 80.9, delay: 380, radius: 16 },
    ],
  },
  12: {
    className: 'ai-style-guide-motion',
    parts: [
      { left: 6.7, top: 29.6, width: 36.7, height: 64.7, delay: 100, radius: 18 },
      { left: 48.8, top: 29.6, width: 44, height: 64.7, delay: 320, radius: 18 },
    ],
  },
};

const dongMotionPresets: Record<number, DetailMotionPart[]> = {
  3: [
    { left: 4.6, top: 23, width: 28.8, height: 61, delay: 80, radius: 18 },
    { left: 35.7, top: 23, width: 29.3, height: 61, delay: 420, radius: 18 },
    { left: 67.4, top: 23, width: 28.7, height: 61, delay: 760, radius: 18 },
  ],
  6: [
    { left: 2.5, top: 23, width: 17.5, height: 63, delay: 60, radius: 12 },
    { left: 20, top: 23, width: 18, height: 63, delay: 260, radius: 12 },
    { left: 38, top: 23, width: 18, height: 63, delay: 460, radius: 12 },
    { left: 56, top: 23, width: 19, height: 63, delay: 660, radius: 12 },
    { left: 75, top: 23, width: 22, height: 63, delay: 860, radius: 12 },
  ],
  7: [
    { left: 3.8, top: 25, width: 19.2, height: 59, delay: 80, radius: 14 },
    { left: 26.5, top: 25, width: 18.2, height: 59, delay: 420, radius: 14 },
    { left: 48, top: 25, width: 17.2, height: 59, delay: 760, radius: 14 },
  ],
  8: [
    { left: 40.5, top: 22.4, width: 16.7, height: 62.6, delay: 80, radius: 12 },
    { left: 58, top: 22.4, width: 16.7, height: 62.6, delay: 420, radius: 12 },
    { left: 75.3, top: 22.4, width: 18, height: 62.6, delay: 760, radius: 12 },
  ],
  10: [
    { left: 1.5, top: 35.5, width: 18.5, height: 53.5, delay: 60, radius: 10 },
    { left: 20, top: 35.5, width: 20, height: 53.5, delay: 260, radius: 10 },
    { left: 40, top: 35.5, width: 20, height: 53.5, delay: 460, radius: 10 },
    { left: 60, top: 35.5, width: 20, height: 53.5, delay: 660, radius: 10 },
    { left: 80, top: 35.5, width: 18.5, height: 53.5, delay: 860, radius: 10 },
  ],
  12: [
    { left: 30, top: 42, width: 22, height: 39, delay: 100, radius: 14 },
    { left: 52, top: 42, width: 22, height: 39, delay: 460, radius: 14 },
    { left: 74, top: 42, width: 23, height: 39, delay: 820, radius: 14 },
  ],
};

const dongGradientPresets: Record<number, Array<DetailMotionPart & { kind: 'text' | 'image' }>> = {
  1: [
    { kind: 'text', left: 3, top: 4.5, width: 53, height: 9.5, delay: 60, radius: 4 },
    { kind: 'image', left: 7.5, top: 30, width: 22, height: 39, delay: 420, radius: 999 },
    { kind: 'image', left: 72.5, top: 30, width: 22, height: 39, delay: 720, radius: 999 },
  ],
  2: [
    { kind: 'text', left: 3, top: 5, width: 52, height: 9, delay: 80, radius: 4 },
    { kind: 'image', left: 11.5, top: 32.7, width: 31.7, height: 37.3, delay: 440, radius: 8 },
    { kind: 'image', left: 49.1, top: 32.7, width: 40.8, height: 37.3, delay: 740, radius: 8 },
  ],
  4: [
    { kind: 'text', left: 35.8, top: 27.5, width: 25, height: 13, delay: 100, radius: 4 },
    { kind: 'image', left: 7, top: 48.5, width: 41.5, height: 17, delay: 460, radius: 8 },
    { kind: 'image', left: 50.8, top: 15, width: 48.7, height: 53, delay: 780, radius: 10 },
  ],
  5: [
    { kind: 'text', left: 4.2, top: 23, width: 27, height: 57, delay: 100, radius: 6 },
    { kind: 'image', left: 34, top: 19, width: 62, height: 68, delay: 560, radius: 10 },
  ],
};

const boundPieGroupedMotionPresets: Record<number, { className: string; partClass: string; count: number }> = {
  7: { className: 'bound-pie-data-motion', partClass: 'data-panel', count: 1 },
  10: { className: 'bound-pie-market-motion', partClass: 'market-photo', count: 3 },
  18: { className: 'bound-pie-benefits-motion', partClass: 'benefit-group', count: 3 },
  19: { className: 'bound-pie-logo-motion', partClass: 'logo-group', count: 1 },
  24: { className: 'bound-pie-pricing-motion', partClass: 'pricing-group', count: 3 },
};
const boundPieMotionPages = new Set([7, 10, 13, 15, 18, 19, 24]);

function BoundPieVideoPage({ pageSrc }: { pageSrc: string }) {
  const [started, setStarted] = useState(false);

  return (
    <figure className="pdf-motion-page pdf-layered-page bound-pie-video-page">
      <img className="pdf-page-base" src={pageSrc} alt="弹性派项目介绍第 17 页，产品展示与内容运营" />
      {started ? (
        <video
          className="bound-pie-embedded-video"
          src="/projects/bound-pie/video/bound-pie.mp4"
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label="弹性派产品展示视频"
        />
      ) : (
        <>
          <button
            className="bound-pie-video-start"
            type="button"
            onClick={() => setStarted(true)}
            aria-label="播放弹性派产品展示视频"
          />
          <span className="bound-pie-video-hint">点击播放视频</span>
        </>
      )}
    </figure>
  );
}

function BoundPieMotionPage({ index, pageSrc }: { index: number; pageSrc: string }) {
  const pageRef = useRef<HTMLElement>(null);
  const [played, setPlayed] = useState(false);
  const isConceptPage = index === 13;
  const isShowcasePage = index === 15;
  const groupedPreset = boundPieGroupedMotionPresets[index];

  useEffect(() => {
    const page = pageRef.current;
    if (!page || played) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
          setPlayed(true);
          observer.disconnect();
        }
      },
      { root: page.closest('.dong-detail-panel'), threshold: [0.24, 0.42, 0.66] },
    );
    observer.observe(page);
    return () => observer.disconnect();
  }, [played]);

  return (
    <figure
      ref={pageRef}
      className={`pdf-motion-page pdf-layered-page bound-pie-reference-motion ${isConceptPage ? 'bound-pie-concept-motion' : isShowcasePage ? 'bound-pie-showcase-motion' : groupedPreset?.className ?? ''}${played ? ' is-motion-active' : ''}`}
    >
      <img className="pdf-page-base" src={pageSrc} alt={`弹性派项目介绍第 ${index + 1} 页`} loading={index > 0 ? 'lazy' : undefined} />
      {isConceptPage ? (
        <div className="bound-pie-motion-layer" aria-hidden="true">
          <span className="bound-pie-motion-mask concept-label-mask concept-label-mask-1" />
          <span className="bound-pie-motion-mask concept-label-mask concept-label-mask-2" />
          <span className="bound-pie-motion-mask concept-label-mask concept-label-mask-3" />
          <span className="bound-pie-motion-mask concept-copy-mask" />
          <img className="bound-pie-motion-overlay concept-label-overlay concept-label-overlay-1" src={pageSrc} alt="" />
          <img className="bound-pie-motion-overlay concept-label-overlay concept-label-overlay-2" src={pageSrc} alt="" />
          <img className="bound-pie-motion-overlay concept-label-overlay concept-label-overlay-3" src={pageSrc} alt="" />
          <img className="bound-pie-motion-overlay concept-copy-overlay" src={pageSrc} alt="" />
          <span className="bound-pie-concept-flow" />
        </div>
      ) : isShowcasePage ? (
        <div className="bound-pie-motion-layer" aria-hidden="true">
          <span className="bound-pie-motion-mask showcase-photo-mask showcase-photo-mask-1" />
          <span className="bound-pie-motion-mask showcase-photo-mask showcase-photo-mask-2" />
          <span className="bound-pie-motion-mask showcase-photo-mask showcase-photo-mask-3" />
          <img className="bound-pie-motion-overlay showcase-photo-overlay showcase-photo-overlay-1" src={pageSrc} alt="" />
          <img className="bound-pie-motion-overlay showcase-photo-overlay showcase-photo-overlay-2" src={pageSrc} alt="" />
          <img className="bound-pie-motion-overlay showcase-photo-overlay showcase-photo-overlay-3" src={pageSrc} alt="" />
        </div>
      ) : groupedPreset ? (
        <div className="bound-pie-motion-layer" aria-hidden="true">
          {Array.from({ length: groupedPreset.count }, (_, partIndex) => (
            <span
              className={`bound-pie-motion-mask bound-pie-element-mask ${groupedPreset.partClass}-mask ${groupedPreset.partClass}-mask-${partIndex + 1}`}
              key={`mask-${partIndex}`}
            />
          ))}
          {Array.from({ length: groupedPreset.count }, (_, partIndex) => (
            <img
              className={`bound-pie-motion-overlay bound-pie-element-overlay ${groupedPreset.partClass}-overlay ${groupedPreset.partClass}-overlay-${partIndex + 1}`}
              src={pageSrc}
              alt=""
              key={`overlay-${partIndex}`}
            />
          ))}
        </div>
      ) : null}
    </figure>
  );
}

function AiMotionPage({ index, pageSrc }: { index: number; pageSrc: string }) {
  const pageRef = useRef<HTMLElement>(null);
  const [played, setPlayed] = useState(false);
  const preset = aiMotionPresets[index];

  useEffect(() => {
    const page = pageRef.current;
    if (!page || played) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
          setPlayed(true);
          observer.disconnect();
        }
      },
      { root: page.closest('.dong-detail-panel'), threshold: [0.24, 0.42, 0.66] },
    );
    observer.observe(page);
    return () => observer.disconnect();
  }, [played]);

  return (
    <figure
      ref={pageRef}
      className={`pdf-motion-page pdf-layered-page ai-reference-motion ${preset.className}${played ? ' is-motion-active' : ''}`}
    >
      <img className="pdf-page-base" src={pageSrc} alt={`AI 实训平台优化项目介绍第 ${index + 1} 页`} loading="lazy" />
      <div className="ai-motion-layer" aria-hidden="true">
        {preset.parts.map((part, partIndex) => {
          const right = Math.max(0, 100 - part.left - part.width).toFixed(2);
          const bottom = Math.max(0, 100 - part.top - part.height).toFixed(2);
          const radius = part.radius ?? 16;

          return (
            <span className="ai-motion-part" key={partIndex}>
              <span
                className="ai-motion-mask"
                style={{ left: `${part.left}%`, top: `${part.top}%`, width: `${part.width}%`, height: `${part.height}%`, borderRadius: `${radius}px` }}
              />
              <img
                className="ai-motion-overlay"
                src={pageSrc}
                alt=""
                style={{ clipPath: `inset(${part.top}% ${right}% ${bottom}% ${part.left}% round ${radius}px)`, animationDelay: `${part.delay}ms` }}
              />
            </span>
          );
        })}
      </div>
    </figure>
  );
}

function DongMotionPage({ index, pageSrc }: { index: number; pageSrc: string }) {
  const pageRef = useRef<HTMLElement>(null);
  const [played, setPlayed] = useState(false);
  const parts = dongMotionPresets[index] ?? [];
  const gradientParts = dongGradientPresets[index] ?? [];

  useEffect(() => {
    const page = pageRef.current;
    if (!page || played) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
          setPlayed(true);
          observer.disconnect();
        }
      },
      { root: page.closest('.dong-detail-panel'), threshold: [0.24, 0.42, 0.66] },
    );
    observer.observe(page);
    return () => observer.disconnect();
  }, [played]);

  return (
    <figure ref={pageRef} className={`pdf-motion-page pdf-layered-page dong-reference-motion${played ? ' is-motion-active' : ''}`}>
      <img className="pdf-page-base" src={pageSrc} alt={`别有侗听品牌项目介绍第 ${index + 1} 页`} loading="lazy" />
      <div className="dong-motion-layer" aria-hidden="true">
        {parts.map((part, partIndex) => {
          const right = Math.max(0, 100 - part.left - part.width).toFixed(2);
          const bottom = Math.max(0, 100 - part.top - part.height).toFixed(2);
          const radius = part.radius ?? 12;

          return (
            <img
              className="dong-motion-overlay"
              src={pageSrc}
              alt=""
              key={`focus-${partIndex}`}
              style={{ clipPath: `inset(${part.top}% ${right}% ${bottom}% ${part.left}% round ${radius}px)`, animationDelay: `${part.delay}ms` }}
            />
          );
        })}
        {gradientParts.map((part, partIndex) => {
          const right = Math.max(0, 100 - part.left - part.width).toFixed(2);
          const bottom = Math.max(0, 100 - part.top - part.height).toFixed(2);
          const radius = part.radius ?? 12;

          return (
            <img
              className={`dong-gradient-overlay dong-${part.kind}-gradient`}
              src={pageSrc}
              alt=""
              key={`gradient-${partIndex}`}
              style={{ clipPath: `inset(${part.top}% ${right}% ${bottom}% ${part.left}% round ${radius}px)`, animationDelay: `${part.delay}ms` }}
            />
          );
        })}
      </div>
    </figure>
  );
}

const projects = {
  'bound-pie': {
    eyebrow: 'STARTUP PROJECT 01',
    title: 'BOUND PIE 弹性派',
    role: '运营负责人 · 2023.09—2024.02',
    intro: '从市场洞察、品牌定位到内容运营与私域转化，把甜品捏捏概念做成真实运转的校园创业项目。',
    highlights: ['两日一更的小红书内容节奏', '单条爆款视频营收 8,000 元', '对应净利润 5,000 元'],
    images: [
      '/projects/bound-pie/detail/page-01.jpg?v=5',
      '/projects/bound-pie/detail/page-13.jpg?v=5',
      '/projects/bound-pie/detail/page-15.jpg?v=5',
      '/projects/bound-pie/detail/page-16.jpg?v=5',
    ],
  },
  dong: {
    eyebrow: 'BRAND PROJECT 02',
    title: '别有侗听',
    role: '项目总负责人 · 品牌策划 / 设计 / 运营',
    intro: '以侗戏声音文化为核心，把数字叙事、沉浸体验与刺绣文创组织成一条可参与、可购买、可传播的品牌路径。',
    highlights: ['声音可视化 × 故事交互 × 刺绣文创', '完成 10+ 次艺术市集销售', '单日最高销售额 4,000 元'],
    images: ['/projects/dong-brand/slide-01.webp', '/projects/dong-brand/slide-12.webp', '/projects/dong-brand/slide-05.webp', '/projects/dong-brand/preview-04.png'],
  },
  'ai-platform': {
    eyebrow: 'UX PROJECT 03',
    title: 'AI 实训平台优化',
    role: '产品体验优化 · 2025',
    intro: '以竞品分析、用户研究和任务测试为依据，优化续学、碎片课程、快捷操作与环境配置体验。',
    highlights: ['学习路径自定义率提升', '简化环境配置与重复操作', '用灰度测试持续验证方案'],
    images: ['/projects/ai-platform/01.jpg', '/projects/ai-platform/07.jpg', '/projects/ai-platform/10.jpg', '/projects/ai-platform/16.jpg'],
  },
} satisfies Record<ProjectKey, {
  eyebrow: string;
  title: string;
  role: string;
  intro: string;
  highlights: string[];
  images: string[];
}>;

const hoverItems = [
  { id: 'cassette', label: '磁带', tilt: 'left' },
  { id: 'bound-pie', label: '打开弹性派项目', tilt: 'left', panel: 'bound-pie' },
  { id: 'ticket', label: '邮票', tilt: 'right' },
  { id: 'camera', label: '打开拍立得', tilt: 'right', panel: 'camera' },
  { id: 'ai-platform', label: '打开 AI 实训平台项目', tilt: 'right', panel: 'ai-platform' },
  { id: 'dong', label: '打开别有侗听项目', tilt: 'left', panel: 'dong' },
  { id: 'star', label: '星形贴纸', tilt: 'right' },
  { id: 'chat', label: '聊天贴纸', tilt: 'left' },
  { id: 'contact', label: '打开联系方式', tilt: 'right', panel: 'contact' },
  { id: 'figma', label: 'Figma', tilt: 'left' },
  { id: 'blender', label: 'Blender', tilt: 'right' },
  { id: 'canva', label: 'Canva', tilt: 'left' },
  { id: 'capcut', label: 'CapCut', tilt: 'right' },
  { id: 'photoshop', label: 'Photoshop', tilt: 'left' },
  { id: 'gemini', label: 'Gemini', tilt: 'right' },
  { id: 'vscode', label: 'Visual Studio Code', tilt: 'left' },
  { id: 'chatgpt', label: 'ChatGPT', tilt: 'right' },
] satisfies Array<{ id: string; label: string; tilt: 'left' | 'right'; panel?: Exclude<PanelKey, null> }>;

const polaroidPhotos = Array.from({ length: 29 }, (_, index) => `/polaroid-photos/photo-${String(index + 1).padStart(2, '0')}.jpg`);
const portraitPhotoIndexes = new Set([0, 1, 2, 21, 22, 23]);
const portraitPhotos = polaroidPhotos.filter((_, index) => portraitPhotoIndexes.has(index));
const landscapePhotos = polaroidPhotos.filter((_, index) => !portraitPhotoIndexes.has(index));
const fillColumn = (photos: string[]) => Array.from({ length: 10 }, (_, index) => photos[index % photos.length]);
const polaroidColumns = [
  { kind: 'portrait', photos: fillColumn(portraitPhotos) },
  ...Array.from({ length: 3 }, (_, column) => ({
    kind: 'landscape',
    photos: fillColumn(landscapePhotos.filter((_, index) => index % 3 === column)),
  })),
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const homeReadyRef = useRef(false);
  const [homeReady, setHomeReady] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [keychainActive, setKeychainActive] = useState(false);
  const [jellyBurst, setJellyBurst] = useState(0);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [slide, setSlide] = useState(0);

  const finishIntro = useCallback(() => {
    const video = videoRef.current;
    if (video?.duration) {
      video.pause();
      video.currentTime = Math.max(0, video.duration - 0.03);
    }
    homeReadyRef.current = true;
    setHomeReady(true);
    setIntroPlaying(false);
  }, []);

  const playIntro = useCallback(() => {
    const video = videoRef.current;
    if (!video || homeReadyRef.current || !video.paused) return;
    const audio = audioRef.current;
    video.currentTime = 0;
    setIntroPlaying(true);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.36;
      void audio.play().catch(() => setMusicPlaying(false));
    }
    void video.play().catch(() => setIntroPlaying(false));
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !homeReadyRef.current) return;
    if (audio.paused) {
      void audio.play().catch(() => setMusicPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  const openPanel = (next: Exclude<PanelKey, null>) => {
    if (!homeReadyRef.current) return;
    setSlide(0);
    setPanel(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
      if (!panel && !homeReadyRef.current && [' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
        playIntro();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [panel, playIntro]);

  const activeProject = panel && panel in projects ? projects[panel as ProjectKey] : null;

  return (
    <main className={`site-stage${homeReady ? ' home-ready' : ''}${introPlaying ? ' intro-playing' : ''}`}>
      <section
        className="motion-stage"
        aria-label="点击鼠标播放个人网站开场动画并进入主页"
      >
        <div className="motion-canvas">
          <video
            ref={videoRef}
            className="motion-film"
            src="/intro-fast.mp4?v=2"
            muted
            playsInline
            preload="auto"
            aria-label="Maddie Jiang 个人网站开场动效"
            onEnded={finishIntro}
            onError={() => setIntroPlaying(false)}
          />
          <img className="home-still" src="/home-final.jpg" alt="" aria-hidden="true" />
          <audio
            ref={audioRef}
            src="/bgm.mp3"
            loop
            preload="auto"
            onPlay={() => setMusicPlaying(true)}
            onPause={() => setMusicPlaying(false)}
          />

          <div className={`keychain-hover-art ${keychainActive ? 'is-active' : ''}`} aria-hidden="true">
            <img className="keychain-background" src="/home-background.png" alt="" />
            <img
              className="keychain-swing"
              src="/keychain.png"
              alt=""
              onAnimationEnd={() => setKeychainActive(false)}
            />
            <img className="keychain-pin" src="/red-pin.png" alt="" />
          </div>

          <div className="hover-elements">
            {hoverItems.map((item) => item.id === 'cassette' ? (
              <button
                key={item.id}
                className={`hover-item hover-cassette tilt-${item.tilt}${musicPlaying ? ' is-music-playing' : ''}`}
                type="button"
                disabled={!homeReady}
                onClick={toggleMusic}
                aria-label={musicPlaying ? '暂停背景音乐' : '播放背景音乐'}
                aria-pressed={musicPlaying}
              >
                <img src="/interactions/cassette.png" alt="" />
                <span className="cassette-audio-indicator" aria-hidden="true">
                  {musicPlaying ? (
                    <span className="cassette-pause-icon"><i /><i /></span>
                  ) : (
                    <span className="cassette-play-icon" />
                  )}
                </span>
                <span className="cassette-audio-label" aria-hidden="true">
                  {musicPlaying ? '关闭音乐' : '打开音乐'}
                </span>
              </button>
            ) : item.panel ? (
              <button
                key={item.id}
                className={`hover-item hover-${item.id} tilt-${item.tilt}`}
                type="button"
                disabled={!homeReady}
                onClick={() => openPanel(item.panel!)}
                aria-label={item.label}
              >
                <img src={`/interactions/${item.id}.png`} alt="" />
              </button>
            ) : (
              <span
                key={item.id}
                className={`hover-item hover-${item.id} tilt-${item.tilt}`}
                tabIndex={homeReady ? 0 : -1}
                role="img"
                aria-label={item.label}
              >
                <img src={`/interactions/${item.id}.png`} alt="" />
              </span>
            ))}
            <button
              className={`hover-item hover-cake-cat ${jellyBurst ? 'is-jiggling' : ''}`}
              type="button"
              disabled={!homeReady}
              onClick={() => setJellyBurst((burst) => burst + 1)}
              aria-label="捏一捏蛋糕猫咪"
            >
              <img
                key={jellyBurst}
                className="jelly-image"
                src="/interactions/cake-cat.png"
                alt=""
                onAnimationEnd={() => setJellyBurst(0)}
              />
              <span className="jelly-prompt" aria-hidden="true">捏一捏</span>
              <span className="jelly-sparkles" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
              </span>
            </button>
          </div>

          <div className="hotspots" aria-hidden={!homeReady}>
            <button
              className="hotspot hotspot-about"
              type="button"
              disabled={!homeReady}
              onPointerEnter={() => setKeychainActive(true)}
              onFocus={() => setKeychainActive(true)}
              onClick={() => openPanel('about')}
              aria-label="打开关于我"
            ><span>ABOUT ME</span></button>
          </div>
        </div>

        <button className="intro-trigger" type="button" onClick={playIntro} disabled={homeReady || introPlaying} aria-label="点击播放开场动画并进入主页">
          <span className="click-hint" aria-hidden="true">
            <span className="mouse-icon"><i /></span>
            <span>CLICK TO ENTER</span>
          </span>
        </button>
      </section>

      {panel && (
        <div className={`panel-backdrop${panel === 'camera' ? ' photo-gallery-backdrop' : ''}`} role="dialog" aria-modal="true" aria-label="作品详情" onPointerDown={() => setPanel(null)}>
          {panel === 'bound-pie-detail' || panel === 'dong-detail' || panel === 'ai-platform-detail' ? (
            <article className={`dong-detail-panel${panel === 'ai-platform-detail' ? ' project-detail-ai' : panel === 'bound-pie-detail' ? ' project-detail-bound-pie' : ' project-detail-dong'}`} onPointerDown={(event) => event.stopPropagation()}>
              <div className="dong-detail-toolbar">
                <button className="panel-close dong-detail-close" type="button" onClick={() => setPanel(null)} aria-label="关闭项目详情">×</button>
              </div>
              <div className="dong-pdf-pages" aria-label={panel === 'dong-detail' ? '别有侗听品牌项目介绍，共 13 页' : panel === 'bound-pie-detail' ? '弹性派项目介绍，共 37 页' : 'AI 实训平台优化项目介绍，共 16 页'}>
                {Array.from({ length: panel === 'dong-detail' ? 13 : panel === 'bound-pie-detail' ? 37 : 16 }, (_, index) => {
                  const isDongDetail = panel === 'dong-detail';
                  const isBoundPieDetail = panel === 'bound-pie-detail';
                  const isAiDetail = panel === 'ai-platform-detail';
                  const pageSrc = isDongDetail
                    ? `/projects/dong-brand/slide-${String(index + 1).padStart(2, '0')}.webp`
                    : isBoundPieDetail
                      ? `/projects/bound-pie/detail/page-${String(index + 1).padStart(2, '0')}.jpg?v=5`
                      : `/projects/ai-platform/detail/page-${String(index + 1).padStart(2, '0')}.jpg`;

                  return isBoundPieDetail && index === 16 ? (
                    <BoundPieVideoPage key={index} pageSrc={pageSrc} />
                  ) : isBoundPieDetail && boundPieMotionPages.has(index) ? (
                    <BoundPieMotionPage index={index} key={index} pageSrc={pageSrc} />
                  ) : isAiDetail && aiMotionPresets[index] ? (
                    <AiMotionPage index={index} key={index} pageSrc={pageSrc} />
                  ) : isDongDetail && (dongMotionPresets[index] || dongGradientPresets[index]) ? (
                    <DongMotionPage index={index} key={index} pageSrc={pageSrc} />
                  ) : (
                    <figure className="pdf-motion-page" key={index}>
                      <img
                        className="pdf-page-base"
                        src={pageSrc}
                        alt={`${isDongDetail ? '别有侗听品牌' : isBoundPieDetail ? '弹性派' : 'AI 实训平台优化'}项目介绍第 ${index + 1} 页`}
                        loading={(isDongDetail || isBoundPieDetail) && index > 0 ? 'lazy' : undefined}
                      />
                    </figure>
                  );
                })}
              </div>
            </article>
          ) : activeProject ? (
            <article className={`project-panel project-${panel}`} onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <div className="project-gallery">
                <div
                  className="project-preview project-scroll-preview"
                  onScroll={(event) => {
                    const target = event.currentTarget;
                    const index = Array.from(target.children).reduce((closest, item, candidate) => {
                      const currentDistance = Math.abs((item as HTMLElement).offsetTop - target.scrollTop);
                      const closestDistance = Math.abs((target.children[closest] as HTMLElement).offsetTop - target.scrollTop);
                      return currentDistance < closestDistance ? candidate : closest;
                    }, 0);
                    setSlide(index);
                  }}
                >
                  {activeProject.images.map((image, index) => (
                    <img key={image} src={image} alt={`${activeProject.title}项目画面 ${index + 1}`} />
                  ))}
                </div>
                <div className="gallery-count">{String(slide + 1).padStart(2, '0')} / {String(activeProject.images.length).padStart(2, '0')}</div>
              </div>
              <div className="project-copy">
                <p className="eyebrow">{activeProject.eyebrow}</p>
                {panel === 'bound-pie' ? (
                  <h1 className="bound-pie-title">
                    <span>BOUND PIE</span>
                    <span>弹性派</span>
                  </h1>
                ) : (
                  <h1>{activeProject.title}</h1>
                )}
                <p className="role-line">{activeProject.role}</p>
                <p className="project-intro">{activeProject.intro}</p>
                <ul>{activeProject.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                {(panel === 'bound-pie' || panel === 'dong' || panel === 'ai-platform') && (
                  <button type="button" className="project-detail-button" onClick={() => setPanel(panel === 'dong' ? 'dong-detail' : panel === 'bound-pie' ? 'bound-pie-detail' : 'ai-platform-detail')}>
                    查看详情
                  </button>
                )}
              </div>
            </article>
          ) : panel === 'about' ? (
            <article className="about-panel" onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <div className="portrait-wrap"><img src="/about-photo.png" alt="蒋倩在喷泉前的生活照" /></div>
              <div className="about-copy">
                <p className="eyebrow">ABOUT ME / 关于我</p>
                <h1>你好，我是蒋倩。</h1>
                <p className="about-intro">运营策划、视觉设计与产品体验的跨界实践者。我喜欢把模糊的想法拆成清晰路径，再把它推到真实世界里。</p>
                <div className="about-divider" />
                <section className="about-highlights" aria-label="个人亮点">
                  <article className="about-highlight">
                    <span>01 / 品牌运营</span>
                    <strong>内容与增长</strong>
                    <p>搭建小红书稳定更新体系，孵化多条百赞内容。</p>
                  </article>
                  <article className="about-highlight">
                    <span>02 / 商业转化</span>
                    <strong>让创意落地</strong>
                    <p>单条爆款营收 8,000 元，净利润 5,000 元。</p>
                  </article>
                  <article className="about-highlight">
                    <span>03 / 跨界实践</span>
                    <strong>AIGC × 视觉 × 产品</strong>
                    <p>从策略、设计到真实运营，完成项目闭环。</p>
                  </article>
                </section>
                <section className="about-experience" aria-label="工作经历">
                  <article>
                    <span>2024.08—2025.03</span>
                    <strong>极氪智能科技（杭州）有限公司</strong>
                    <p>市场部 · 视觉设计</p>
                    <em>优化营销物料的信息触达，助力产品留资率提升 20%。</em>
                  </article>
                  <article>
                    <span>2022.06—2022.08</span>
                    <strong>常州壹流铭传媒有限公司</strong>
                    <p>项目经理 · 设计剪辑</p>
                    <em>统筹营销项目、品牌视觉与影像内容的完整交付。</em>
                  </article>
                </section>
                <a className="resume-link" href="/jiang-qian-resume.pdf" target="_blank" rel="noreferrer">查看简历</a>
              </div>
            </article>
          ) : panel === 'contact' ? (
            <article className="contact-panel" onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <p className="eyebrow">OTHERS / CONTACT</p>
              <h1>Let&apos;s make<br />something happen.</h1>
              <p>如果你也相信，好想法应该被推向现实，欢迎来找我聊聊。</p>
              <a href="mailto:1921776952@qq.com">1921776952@qq.com ↗</a>
            </article>
          ) : (
            <article
              className="photo-gallery-panel"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <button className="panel-close photo-gallery-close" type="button" onClick={() => setPanel(null)} aria-label="关闭照片展示">×</button>
              <header className="photo-gallery-header">
                <p className="eyebrow">POLAROID ARCHIVE / 拍立得影像</p>
              <h1>记录幸福瞬间，也是我的充电方式</h1>
              </header>
              <div className="photo-gallery-stream" aria-label="自动循环播放的拍立得照片集">
                {polaroidColumns.map(({ kind, photos }, column) => (
                  <div className={`photo-gallery-column photo-gallery-column-${kind}`} key={column}>
                    <div className="photo-gallery-track">
                      {[0, 1].map((copy) => (
                        <div className="photo-gallery-set" key={copy} aria-hidden={copy === 1}>
                          {photos.map((src, photoIndex) => {
                            const index = polaroidPhotos.indexOf(src);
                            return (
                              <figure className="photo-gallery-item" key={`${copy}-${photoIndex}-${src}`}>
                                <img src={src} alt={copy === 0 ? `拍立得照片 ${index + 1}` : ''} draggable="false" />
                              </figure>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      )}
    </main>
  );
}
