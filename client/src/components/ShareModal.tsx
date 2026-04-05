/**
 * ShareModal — Card visual premium para compartilhamento de conquistas e níveis.
 * Glass Cockpit Design | VPEX Hub
 *
 * Gera um card visual renderizado em canvas que pode ser compartilhado
 * via WhatsApp, Instagram, LinkedIn, Twitter/X ou copiado como link.
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  MessageCircle,
  Linkedin,
  Twitter,
  Instagram,
  Sparkles,
  Trophy,
  Star,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface ShareBadge {
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface ShareData {
  type: "level" | "badge" | "milestone";
  level: number;
  totalXP: number;
  badgesEarned: number;
  milestonesCompleted: number;
  totalMilestones: number;
  userName?: string;
  badgeTitle?: string;
  badgeRarity?: "common" | "rare" | "epic" | "legendary";
  milestoneTitle?: string;
  earnedBadges?: ShareBadge[];
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

/* ─── Helpers ─── */
const rarityColors: Record<string, string> = {
  common: "#9CA3AF",
  rare: "#60A5FA",
  epic: "#A855F7",
  legendary: "#FBBF24",
};

const rarityLabels: Record<string, string> = {
  common: "COMUM",
  rare: "RARO",
  epic: "ÉPICO",
  legendary: "LENDÁRIO",
};

function getShareText(data: ShareData): string {
  const base = `Estou no Nível ${data.level} no VPEX Hub com ${data.totalXP} XP!`;
  if (data.type === "badge" && data.badgeTitle) {
    return `Desbloqueei a conquista "${data.badgeTitle}" no VPEX Hub! ${base} #VPEXHub #Crescimento`;
  }
  if (data.type === "milestone" && data.milestoneTitle) {
    return `Alcancei o marco "${data.milestoneTitle}" no VPEX Hub! ${base} #VPEXHub #Crescimento`;
  }
  return `${base} Já completei ${data.milestonesCompleted} de ${data.totalMilestones} marcos e desbloqueei ${data.badgesEarned} conquistas! #VPEXHub #Crescimento`;
}

function getShareUrl(): string {
  return "https://hub.vpex.com.br";
}

/* ─── Social Share Links ─── */
function shareToWhatsApp(text: string) {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + "\n\n" + getShareUrl())}`, "_blank");
}

function shareToLinkedIn(text: string) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}&summary=${encodeURIComponent(text)}`, "_blank");
}

function shareToTwitter(text: string) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`, "_blank");
}

/* ─── Canvas Card Renderer ─── */
function drawShareCard(
  canvas: HTMLCanvasElement,
  data: ShareData
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 600;
  const h = 340;
  canvas.width = w * 2;
  canvas.height = h * 2;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.scale(2, 2);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#0A0A0A");
  bgGrad.addColorStop(0.5, "#0F1A0F");
  bgGrad.addColorStop(1, "#0A0A0A");
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 0, 0, w, h, 16);
  ctx.fill();

  // Border
  ctx.strokeStyle = "rgba(57, 255, 20, 0.25)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, 0, 0, w, h, 16);
  ctx.stroke();

  // Glow particles
  for (let i = 0; i < 12; i++) {
    const px = 50 + Math.random() * (w - 100);
    const py = 30 + Math.random() * (h - 60);
    const size = 1 + Math.random() * 2;
    ctx.fillStyle = `rgba(57, 255, 20, ${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // VPEX Hub logo text
  ctx.fillStyle = "#39FF14";
  ctx.font = "bold 14px 'Sora', sans-serif";
  ctx.fillText("VPEX Hub", 28, 36);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "11px 'Inter', sans-serif";
  ctx.fillText("Crescimento Gamificado", 120, 36);

  // Divider line
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 52);
  ctx.lineTo(w - 28, 52);
  ctx.stroke();

  // Level badge
  const badgeX = 28;
  const badgeY = 70;
  const badgeSize = 64;

  // Badge background
  const badgeGrad = ctx.createRadialGradient(
    badgeX + badgeSize / 2, badgeY + badgeSize / 2, 0,
    badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize
  );
  badgeGrad.addColorStop(0, "rgba(57, 255, 20, 0.15)");
  badgeGrad.addColorStop(1, "rgba(57, 255, 20, 0.03)");
  ctx.fillStyle = badgeGrad;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(57, 255, 20, 0.35)";
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 14);
  ctx.stroke();

  // Level number
  ctx.fillStyle = "#39FF14";
  ctx.font = "bold 28px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${data.level}`, badgeX + badgeSize / 2, badgeY + 42);
  ctx.textAlign = "left";

  // Level text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px 'Sora', sans-serif";
  ctx.fillText(`Nível ${data.level}`, badgeX + badgeSize + 16, badgeY + 28);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "12px 'Inter', sans-serif";
  ctx.fillText(`${data.totalXP} XP total`, badgeX + badgeSize + 16, badgeY + 50);

  // Stats row
  const statsY = badgeY + badgeSize + 24;
  const stats = [
    { label: "Marcos", value: `${data.milestonesCompleted}/${data.totalMilestones}`, color: "#39FF14" },
    { label: "Conquistas", value: `${data.badgesEarned}`, color: "#39FF14" },
    { label: "XP Total", value: `${data.totalXP}`, color: "#FBBF24" },
  ];

  const statWidth = (w - 56 - 24) / 3;
  stats.forEach((stat, i) => {
    const sx = 28 + i * (statWidth + 12);
    // Stat box
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    roundRect(ctx, sx, statsY, statWidth, 52, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    roundRect(ctx, sx, statsY, statWidth, 52, 10);
    ctx.stroke();

    ctx.fillStyle = stat.color;
    ctx.font = "bold 18px 'Sora', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(stat.value, sx + statWidth / 2, statsY + 24);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "10px 'Inter', sans-serif";
    ctx.fillText(stat.label, sx + statWidth / 2, statsY + 42);
    ctx.textAlign = "left";
  });

  // Badge/Milestone specific content
  if (data.type === "badge" && data.badgeTitle && data.badgeRarity) {
    const highlightY = statsY + 72;
    const rarityColor = rarityColors[data.badgeRarity] || "#9CA3AF";

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    roundRect(ctx, 28, highlightY, w - 56, 44, 10);
    ctx.fill();
    ctx.strokeStyle = rarityColor + "40";
    ctx.lineWidth = 1;
    roundRect(ctx, 28, highlightY, w - 56, 44, 10);
    ctx.stroke();

    ctx.fillStyle = rarityColor;
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.fillText(rarityLabels[data.badgeRarity] || "COMUM", 44, highlightY + 16);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px 'Sora', sans-serif";
    ctx.fillText(`Conquista: ${data.badgeTitle}`, 44, highlightY + 32);
  } else if (data.type === "milestone" && data.milestoneTitle) {
    const highlightY = statsY + 72;

    ctx.fillStyle = "rgba(57, 255, 20, 0.03)";
    roundRect(ctx, 28, highlightY, w - 56, 44, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(57, 255, 20, 0.15)";
    ctx.lineWidth = 1;
    roundRect(ctx, 28, highlightY, w - 56, 44, 10);
    ctx.stroke();

    ctx.fillStyle = "#39FF14";
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.fillText("MARCO ALCANÇADO", 44, highlightY + 16);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px 'Sora', sans-serif";
    ctx.fillText(data.milestoneTitle, 44, highlightY + 32);
  } else {
    // Show earned badges row
    if (data.earnedBadges && data.earnedBadges.length > 0) {
      const highlightY = statsY + 72;
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "bold 9px 'Inter', sans-serif";
      ctx.fillText("CONQUISTAS DESBLOQUEADAS", 28, highlightY);

      const maxShow = Math.min(data.earnedBadges.length, 4);
      const chipWidth = (w - 56 - (maxShow - 1) * 8) / maxShow;
      data.earnedBadges.slice(0, maxShow).forEach((b, i) => {
        const cx = 28 + i * (chipWidth + 8);
        const cy = highlightY + 8;
        const rc = rarityColors[b.rarity] || "#9CA3AF";

        ctx.fillStyle = rc + "15";
        roundRect(ctx, cx, cy, chipWidth, 30, 8);
        ctx.fill();
        ctx.strokeStyle = rc + "30";
        ctx.lineWidth = 1;
        roundRect(ctx, cx, cy, chipWidth, 30, 8);
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "10px 'Inter', sans-serif";
        ctx.textAlign = "center";
        const truncTitle = b.title.length > 14 ? b.title.slice(0, 12) + "…" : b.title;
        ctx.fillText(truncTitle, cx + chipWidth / 2, cy + 19);
        ctx.textAlign = "left";
      });
    }
  }

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillText("hub.vpex.com.br", 28, h - 16);

  ctx.fillStyle = "rgba(57, 255, 20, 0.3)";
  ctx.font = "bold 10px 'Inter', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Powered by VPEX Solutions", w - 28, h - 16);
  ctx.textAlign = "left";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─── Social Button ─── */
function SocialButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 border border-border hover:border-opacity-50 transition-all group"
      style={{ ["--btn-color" as string]: color }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </motion.button>
  );
}

/* ─── Main Component ─── */
export default function ShareModal({ isOpen, onClose, data }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const shareText = getShareText(data);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      // Small delay to ensure fonts are loaded
      setTimeout(() => {
        if (canvasRef.current) drawShareCard(canvasRef.current, data);
      }, 100);
    }
  }, [isOpen, data]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `vpex-hub-nivel-${data.level}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    toast.success("Imagem salva!", { description: "O card foi baixado para o seu dispositivo." });
  }, [data.level]);

  const handleCopyText = useCallback(() => {
    navigator.clipboard.writeText(shareText + "\n\n" + getShareUrl());
    setCopied(true);
    toast.success("Texto copiado!");
    setTimeout(() => setCopied(false), 2000);
  }, [shareText]);

  const handleNativeShare = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `vpex-hub-nivel-${data.level}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `VPEX Hub — Nível ${data.level}`,
            text: shareText,
            files: [file],
          });
        } else {
          handleCopyText();
        }
      });
    } catch {
      handleCopyText();
    }
  }, [data.level, shareText, handleCopyText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[640px] glass-card p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-vpex-green/10 border border-vpex-green/20 flex items-center justify-center">
                  <Share2 size={14} className="text-vpex-green" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground font-[Sora]">Compartilhar Progresso</h3>
                  <p className="text-[10px] text-muted-foreground">Mostre suas conquistas para o mundo</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>

            {/* Card Preview */}
            <div className="flex justify-center mb-5">
              <div className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.1)] border border-vpex-green/10">
                <canvas ref={canvasRef} className="block" />
              </div>
            </div>

            {/* Share Text Preview */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border mb-5">
              <p className="text-xs text-foreground leading-relaxed">{shareText}</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <SocialButton
                icon={MessageCircle}
                label="WhatsApp"
                color="#25D366"
                onClick={() => shareToWhatsApp(shareText)}
              />
              <SocialButton
                icon={Instagram}
                label="Instagram"
                color="#E1306C"
                onClick={handleDownload}
              />
              <SocialButton
                icon={Linkedin}
                label="LinkedIn"
                color="#0A66C2"
                onClick={() => shareToLinkedIn(shareText)}
              />
              <SocialButton
                icon={Twitter}
                label="X / Twitter"
                color="#1DA1F2"
                onClick={() => shareToTwitter(shareText)}
              />
              <SocialButton
                icon={Share2}
                label="Mais"
                color="#39FF14"
                onClick={handleNativeShare}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-muted/30 border border-border text-foreground hover:bg-muted/50 transition-all"
              >
                <Download size={14} />
                Baixar Imagem
              </button>
              <button
                onClick={handleCopyText}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-vpex-green/10 border border-vpex-green/20 text-vpex-green hover:bg-vpex-green hover:text-black transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiado!" : "Copiar Texto"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
