'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';

type ProjectKey = 'bound-pie' | 'dong' | 'ai-platform';
type PanelKey = ProjectKey | 'about' | 'contact' | 'camera' | null;

const projects = {
  'bound-pie': {
    eyebrow: 'STARTUP PROJECT 01',
    title: 'BOUND PIE 弹性派',
    role: '运营负责人 · 2023.09—2024.02',
    intro: '从市场洞察、品牌定位到内容运营与私域转化，把甜品捏捏概念做成真实运转的校园创业项目。',
    highlights: ['两日一更的小红书内容节奏', '单条爆款视频营收 8,000 元', '对应净利润 5,000 元'],
    images: ['/projects/bound-pie/01.jpg', '/projects/bound-pie/14.jpg', '/projects/bound-pie/19.jpg', '/projects/bound-pie/33.jpg'],
  },
  dong: {
    eyebrow: 'HERITAGE PROJECT 02',
    title: '别有侗听',
    role: '项目总负责人 · 2025.06',
    intro: '从贵州实地调研出发，统筹文化研究、视觉系统、数字化叙事与手工饰品转化，让毕业设计走向真实市场。',
    highlights: ['贵州侗寨实地调研', '侗歌、纹样与银饰的当代转译', '项目整体创收超过 20,000 元'],
    images: ['/projects/dong/01.jpg', '/projects/dong/34.jpg', '/projects/dong/46.jpg', '/projects/dong/58.jpg'],
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

const HOME_THRESHOLD = 0.985;
const WHEEL_RATE = 0.00082;
const FRAME_SECONDS = 1 / 30;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const durationRef = useRef(7.733333);
  const frameRef = useRef<number | null>(null);
  const homeReadyRef = useRef(false);
  const touchRef = useRef<{ y: number; progress: number } | null>(null);
  const [homeReady, setHomeReady] = useState(false);
  const [keychainActive, setKeychainActive] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [slide, setSlide] = useState(0);

  const paint = useCallback(() => {
    frameRef.current = null;
    const video = videoRef.current;
    if (!video || video.readyState < 1) return;

    const lastFrame = Math.max(0, durationRef.current - FRAME_SECONDS);
    const targetTime = progressRef.current * lastFrame;
    if (Math.abs(video.currentTime - targetTime) > 0.004) video.currentTime = targetTime;

    const nextReady = progressRef.current >= HOME_THRESHOLD;
    if (homeReadyRef.current !== nextReady) {
      homeReadyRef.current = nextReady;
      setHomeReady(nextReady);
      if (!nextReady) {
        setKeychainActive(false);
        setPanel(null);
      }
    }
  }, []);

  const setTimeline = useCallback((value: number) => {
    progressRef.current = Math.min(1, Math.max(0, value));
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(paint);
  }, [paint]);

  const onWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (panel) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    setTimeline(progressRef.current + event.deltaY * unit * WHEEL_RATE);
  };

  const onTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    touchRef.current = { y: event.touches[0].clientY, progress: progressRef.current };
  };

  const onTouchMove = (event: ReactTouchEvent<HTMLElement>) => {
    if (!touchRef.current || panel) return;
    event.preventDefault();
    const distance = touchRef.current.y - event.touches[0].clientY;
    setTimeline(touchRef.current.progress + distance / Math.max(480, window.innerHeight * 0.9));
  };

  const openPanel = (next: Exclude<PanelKey, null>) => {
    if (!homeReadyRef.current) return;
    setSlide(0);
    setPanel(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
      if (panel) return;
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
        setTimeline(progressRef.current + 0.08);
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        setTimeline(progressRef.current - 0.08);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [panel, setTimeline]);

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  const activeProject = panel && panel in projects ? projects[panel as ProjectKey] : null;

  return (
    <main className={`site-stage ${homeReady ? 'home-ready' : ''}`}>
      <section
        className="motion-stage"
        aria-label="滚动鼠标控制个人网站开场动画；向上滚动可返回封面"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { touchRef.current = null; }}
      >
        <div className="motion-canvas">
          <video
            ref={videoRef}
            className="motion-film"
            src="/intro.mp4?v=2"
            muted
            playsInline
            preload="auto"
            aria-label="Maddie Jiang 个人网站开场动效"
            onLoadedMetadata={(event) => {
              durationRef.current = event.currentTarget.duration || durationRef.current;
              setTimeline(progressRef.current);
            }}
          />

          <div className={`keychain-hover-art ${keychainActive ? 'is-active' : ''}`} aria-hidden="true">
            <img className="keychain-eraser" src="/keychain-eraser.png" alt="" />
            <img className="keychain-swing" src="/keychain.png" alt="" />
          </div>

          <div className="hotspots" aria-hidden={!homeReady}>
            <button
              className="hotspot hotspot-about"
              type="button"
              disabled={!homeReady}
              onPointerEnter={() => setKeychainActive(true)}
              onPointerLeave={() => setKeychainActive(false)}
              onFocus={() => setKeychainActive(true)}
              onBlur={() => setKeychainActive(false)}
              onClick={() => openPanel('about')}
              aria-label="打开关于我"
            ><span>ABOUT ME</span></button>
            <button className="hotspot hotspot-bound" type="button" disabled={!homeReady} onClick={() => openPanel('bound-pie')} aria-label="打开弹性派项目"><span>BOUND PIE</span></button>
            <button className="hotspot hotspot-dong" type="button" disabled={!homeReady} onClick={() => openPanel('dong')} aria-label="打开别有侗听项目"><span>别有侗听</span></button>
            <button className="hotspot hotspot-ai" type="button" disabled={!homeReady} onClick={() => openPanel('ai-platform')} aria-label="打开 AI 实训平台项目"><span>AI 实训平台</span></button>
            <button className="hotspot hotspot-camera" type="button" disabled={!homeReady} onClick={() => openPanel('camera')} aria-label="打开拍立得"><span>TAKE A SNAP</span></button>
            <button className="hotspot hotspot-contact" type="button" disabled={!homeReady} onClick={() => openPanel('contact')} aria-label="打开联系方式"><span>CONTACT</span></button>
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span className="mouse-icon"><i /></span>
          <span>SCROLL TO PLAY</span>
        </div>
      </section>

      {panel && (
        <div className="panel-backdrop" role="dialog" aria-modal="true" aria-label="作品详情" onPointerDown={() => setPanel(null)}>
          {activeProject ? (
            <article className={`project-panel project-${panel}`} onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <div className="project-gallery">
                <img src={activeProject.images[slide]} alt={`${activeProject.title}项目画面 ${slide + 1}`} />
                <button type="button" className="gallery-arrow prev" onClick={() => setSlide((slide - 1 + activeProject.images.length) % activeProject.images.length)} aria-label="上一张">←</button>
                <button type="button" className="gallery-arrow next" onClick={() => setSlide((slide + 1) % activeProject.images.length)} aria-label="下一张">→</button>
                <div className="gallery-count">{String(slide + 1).padStart(2, '0')} / {String(activeProject.images.length).padStart(2, '0')}</div>
              </div>
              <div className="project-copy">
                <p className="eyebrow">{activeProject.eyebrow}</p>
                <h1>{activeProject.title}</h1>
                <p className="role-line">{activeProject.role}</p>
                <p className="project-intro">{activeProject.intro}</p>
                <ul>{activeProject.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </article>
          ) : panel === 'about' ? (
            <article className="about-panel" onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <div className="portrait-wrap"><img src="/portrait.png" alt="蒋倩创意肖像" /></div>
              <div className="about-copy">
                <p className="eyebrow">ABOUT ME / 关于我</p>
                <h1>你好，我是蒋倩。</h1>
                <p>运营策划、视觉设计与产品体验的跨界实践者。我喜欢把模糊的想法拆成清晰路径，再把它推到真实世界里。</p>
                <dl>
                  <div><dt>江汉大学</dt><dd>数字传媒艺术本科</dd></div>
                  <div><dt>GPA</dt><dd>3.78 / 4.0 · 3 / 50</dd></div>
                  <div><dt>经历</dt><dd>极氪智能科技 · 视觉设计</dd></div>
                </dl>
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
            <article className="camera-panel" onPointerDown={(event) => event.stopPropagation()}>
              <button className="panel-close" type="button" onClick={() => setPanel(null)} aria-label="关闭">×</button>
              <div className="polaroid"><img src="/portrait.png" alt="蒋倩创意肖像" /><p>MADDIE&apos;S CREATIVE DAY<br /><span>2026 · KEEP PLAYING</span></p></div>
            </article>
          )}
        </div>
      )}
    </main>
  );
}
