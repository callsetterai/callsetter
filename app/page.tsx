"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Phone,
  PhoneCall,
  Check,
  ChevronDown,
  Rocket,
  Zap,
  Timer,
  Play,
  X,
} from "lucide-react";

/* ================= BRAND ================= */
const BRAND = {
  purple: "#6D5EF3",
  bg: "#0A0A0F",
  text: "#F3F4F6",
};

const LOGO_SRC = "/logo.png";

/* ================= RAF HOOK ================= */
function useRaf(cb: () => void) {
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const loop = () => {
      cb();
      ref.current = requestAnimationFrame(loop);
    };
    ref.current = requestAnimationFrame(loop);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [cb]);
}

/* ================= HEX WAVE BG ================= */
function HexWave() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useRaf(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth * dpr;
    const h = c.clientHeight * dpr;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    const t = performance.now() / 1200;
    const size = 22 * dpr;
    const hexH = Math.sin(Math.PI / 3) * size;
    const hexW = size * 1.5;

    for (let y = -size; y < h + size; y += hexH * 2) {
      for (let x = -size; x < w + size; x += hexW) {
        const ox = (Math.floor(y / (hexH * 2)) % 2) * (hexW / 2);
        const cx = x + ox;
        const cy = y;

        const d = Math.hypot(cx - w / 2, cy - h / 2);
        const wave = Math.sin(d / 80 - t) * 0.5 + 0.5;
        const a = 0.05 + wave * 0.25;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i;
          const px = cx + size * Math.cos(ang);
          const py = cy + size * Mat*
