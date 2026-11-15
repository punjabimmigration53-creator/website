'use client';

import { useState, useEffect } from 'react';
import reviewsData from '@/data/reviews.json';
import { supabase } from '@/lib/supabaseClient';
import PageHero from '@/components/PageHero';
import Stats from '@/components/Stats';
import FinalCta from '@/components/FinalCta';

const initialVideos = [
  {
    name: "Harpal Singh",
    visa: "UK Study Visa",
    src: "/harpal singh.mp4",
    poster: "/harpal.png"
  },
  {
    name: "Shubpreetpal Singh",
    visa: "UK study visa",
    src: "/shubpreet.mp4",
    poster: "/shubpreetpal.png"
  },
  {
    name: "Preet and her Husband",
    visa: "Spouse visa(UK)",
    src: "/reel1.mp4",
    poster: "/reel image.png"
  }
];

const initialGallery = [
  {
    img: "/uk study visa 1.png",
    name: "Jagbir Singh",
    quote: "I can’t thank the Punjab Immigration team enough! They guided me through every step of my UK Ballot Visa process with full transparency and support."
  },
  {
    img: "/UK STUDY VISA - 2.png",
    name: "Shivraj Singh",
    quote: "I’m so happy to receive my UK Study Visa through Punjab Immigration. The staff were super helpful and guided me at every step!"
  },
  {
    img: "/UK STUDY VISA - 3.png",
    name: "Bhupinder Singh",
    quote: "Big thanks to Punjab Immigration for helping me get my UK Study Visa! The whole process was smooth and transparent. Highly recommend their team!"
  },
  {
    img: "/komalpreet kaur-happy-cust.jpg",
    name: "Komalpreet Kaur",
    quote: "Punjab Immigration made the entire UK Study Visa process simple and transparent. I always felt confident because the team guided me honestly at every step."
  },
  {
    img: "/UK STUDY VISA - 5.png",
    name: "Kulbir Kaur",
    quote: "I am so grateful to Punjab Immigration for helping me with my UK Study Visa. The team was very supportive and handled my file with complete transparency. Thank you for making my dream come true!"
  },
  {
    img: "/uk 6.webp",
    name: "Dawinder Preet Singh",
    quote: "A big thank you to Punjab Immigration! Their guidance was excellent throughout the entire process. If you are looking for a trustworthy team for your UK Study Visa, I highly recommend them."
  },
  {
    img: "/IM15.png",
    name: "Jasmine Kaur",
    quote: "I’m truly grateful to Punjab Immigration for guiding me at every step and helping me get my visa approved in just 5 days."
  },
  {
    img: "/im16.png",
    name: "Shubpreetpal Singh",
    quote: "I’m really thankful to Punjab Immigration for their clear support and guidance that helped me receive my visa in just 2 weeks."
  },
  {
    img: "/IM14.jpg",
    name: "Ravinder Singh",
    quote: "Best immigration consultants in Amritsar. They guide you properly according to your profile."
  },
  {
    img: "/IM12.jpg",
    name: "Gurnoor Singh",
    quote: "I am extremely thankful to the team at Punjab Immigration for their exceptional support in getting my UK Study Visa. Their guidance was clear, and the entire process was seamless. Highly recommended!"
  },
  {
    img: "/IM13.jpg",
    name: "Rajdeep Singh",
    quote: "Big thanks to Punjab Immigration for making my dream of studying in the UK a reality. Their team is very knowledgeable and provided transparent guidance at every step. I received my visa very quickly!"
  },
  {
    img: "/IM11.jpg",
    name: "Rajwinder Kaur",
    quote: "I had a wonderful experience with Punjab Immigration. They helped me navigate the complex UK Study Visa process with ease. Their staff is very helpful and professional. Thank you for everything!"
  }
];

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function HappyCustomers() {
  const [open, setOpen] = useState(null);
  const [shown, setShown] = useState(9);
  const [reviewsList, setReviewsList] = useState(reviewsData);
  const [videosList, setVideosList] = useState(initialVideos);
  const [galleryList, setGalleryList] = useState(initialGallery);

  useEffect(() => {
    // Fetch from Supabase with local JSON fallback
    const fetchSupabaseStories = async () => {
      try {
        const { data, error } = await supabase
          .from('success_stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const videos = data.filter(item => item.type === 'video').map(v => ({
            name: v.name,
            visa: v.visa,
            src: v.media_url,
            poster: v.poster_url
          }));
          const gallery = data.filter(item => item.type === 'gallery').map(g => ({
            img: g.media_url,
            name: g.name,
            quote: g.quote
          }));
          
          if (videos.length > 0) setVideosList(videos);
          if (gallery.length > 0) setGalleryList(gallery);
        } else {
          fetchLocalStories();
        }
      } catch (err) {
        console.warn("[Success Stories] Failed to fetch from Supabase, trying local fallback:", err);
        fetchLocalStories();
      }
    };

    const fetchLocalStories = () => {
      fetch('/success-stories.json')
        .then(res => res.json())
        .then(data => {
          if (data.videos && data.videos.length > 0) setVideosList(data.videos);
          if (data.gallery && data.gallery.length > 0) setGalleryList(data.gallery);
        })
        .catch(err => {
          console.warn("[Success Stories] Failed to fetch local fallback success stories:", err);
        });
    };

    fetchSupabaseStories();

    // Fetch and merge new reviews from sheet
    const REVIEWS_SHEET_URL = "https://script.google.com/macros/s/AKfycbyNFj_SeXGGwS_COcHeHTi9cTT6lp6yhlkRarzsJUrusok4dfz3EnWDGDIjZIINO3RB/exec";
    fetch(REVIEWS_SHEET_URL)
      .then(res => res.json())
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          setReviewsList(prev => {
            const existingNames = prev.map(r => r.name.trim().toLowerCase());
            const newReviews = [];
            data.reviews.forEach(r => {
              if (r.name && !existingNames.includes(r.name.trim().toLowerCase())) {
                newReviews.push(r);
              }
            });
            return [...prev, ...newReviews];
          });
        }
      })
      .catch(err => {
        console.warn("[Success Stories] Failed to sync reviews from sheet:", err);
      });

  }, []);

  // close the lightbox with Escape
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const active = open !== null ? galleryList[open] : null;

  return (
    <main className="lp">
      <PageHero
        eyebrow="Success stories"
        title="Real clients. Real"
        accent="visas."
        desc="Stories from students, families and professionals we have helped."
        crumbs={[{ label: 'Success Stories', href: '/happy-customers' }]}
      />

      {/* WALL OF APPROVALS — 4:5 posts */}
      <section className="lp-section">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Wall of success</p>
            <h2>Visa approvals <em>gallery.</em></h2>
          </div>
          <div className="pg-posts">
            {galleryList.map((item, idx) => (
              <button type="button" className="pg-post" key={`${item.img}-${idx}`} onClick={() => setOpen(idx)} data-reveal style={{ '--d': `${(idx % 4) * 60}ms` }}>
                <img src={item.img} alt={`${item.name} visa approval`} loading="lazy" />
                <span className="pg-post-cap">
                  <b>{item.name}</b>
                  <small>{item.quote}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="lp-section lp-dark">
        <div className="container">
          <div className="lp-head lp-head-center" data-reveal>
            <p className="lp-eyebrow">Video testimonials</p>
            <h2>Watch their <em>stories.</em></h2>
          </div>
          <div className="pg-grid c3">
            {videosList.map((video, idx) => (
              <div className="pg-video" key={`${video.src}-${idx}`} data-reveal style={{ '--d': `${idx * 70}ms` }}>
                <video src={video.src} controls poster={video.poster} preload="none" playsInline>
                  Your browser does not support the video tag.
                </video>
                <div>
                  <b>{video.name}</b>
                  <span>{video.visa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="lp-section lp-muted">
        <div className="container">
          <div className="lp-head" data-reveal>
            <p className="lp-eyebrow">Client reviews</p>
            <h2>What our clients <em>say.</em></h2>
          </div>
          <div className="lp-reviews">
            {reviewsList.slice(0, shown).map((r, i) => (
              <figure key={`${r.name}-${i}`} className="lp-review">
                <div className="lp-stars" aria-label="Rated 5 out of 5">
                  {[0, 1, 2, 3, 4].map((s) => <i key={s} className="fa-solid fa-star"></i>)}
                </div>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  <span className="lp-avatar" aria-hidden="true">{initials(r.name)}</span>
                  <div><b>{r.name}</b><span>{r.visa}</span></div>
                </figcaption>
              </figure>
            ))}
          </div>
          {shown < reviewsList.length && (
            <div className="lp-center" style={{ marginTop: 32 }}>
              <button type="button" className="btn btn-outline" onClick={() => setShown((n) => n + 9)}>
                Show more reviews <i className="fa-solid fa-chevron-down"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      <div style={{ paddingTop: 'clamp(72px, 9vw, 112px)' }}>
        <Stats />
      </div>
      <FinalCta title="Want to be our next success" accent="story?" />

      {active && (
        <div className="pg-lightbox" role="dialog" aria-modal="true" aria-label={`${active.name} visa approval`} onClick={() => setOpen(null)}>
          <button type="button" className="pg-lightbox-close" aria-label="Close" onClick={() => setOpen(null)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="pg-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <img src={active.img} alt={`${active.name} visa approval`} />
            <div className="pg-lightbox-body">
              <div className="lp-stars">{[0, 1, 2, 3, 4].map((s) => <i key={s} className="fa-solid fa-star"></i>)}</div>
              <h3>{active.name}</h3>
              <p>“{active.quote}”</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
