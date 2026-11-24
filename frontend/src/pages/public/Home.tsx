import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  Phone,
  BadgeCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  SearchX,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BikeCard } from '@/components/public/BikeCard';
import { SectionHeading } from '@/components/public/SectionHeading';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { bikesService } from '@/services/bikes';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';
import betaPhoto from '@/assets/beta-300rr-freenduro.jpg';
import ktmPhoto from '@/assets/ktm-enduro-promo.jpg';
import type { Bike } from '@/types';

const BRANDS = [
  'KTM', 'HUSQVARNA', 'GASGAS', 'BETA', 'SHERCO', 'HONDA', 'YAMAHA', 'KAWASAKI', 'SUZUKI',
];

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Bike[]>([]);
  const [latest, setLatest] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [latestError, setLatestError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const latestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react/set-state-in-effect -- reinicio del estado antes de cada carga
    setLoading(true);
    setFeaturedError(false);
    setLatestError(false);
    Promise.allSettled([
      bikesService.list({ featured: true, limit: 3 }),
      bikesService.list({ limit: 4 }),
    ]).then(([featuredRes, latestRes]) => {
      if (cancelled) return;
      // `Array.isArray` es la última línea de defensa: ninguna lista puede
      // llegar a undefined y romper el render con `featured.length`.
      const featuredList = featuredRes.status === 'fulfilled' ? featuredRes.value.data : null;
      const latestList = latestRes.status === 'fulfilled' ? latestRes.value.data : null;
      setFeatured(Array.isArray(featuredList) ? featuredList : []);
      setLatest(Array.isArray(latestList) ? latestList : []);
      setFeaturedError(!Array.isArray(featuredList));
      setLatestError(!Array.isArray(latestList));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => setReloadKey((key) => key + 1);
  const waGeneral = buildWhatsAppLink(BUSINESS.whatsappGeneralMessage);
  const scrollLatest = (direction: number) => {
    latestRef.current?.scrollBy({ left: direction * 380, behavior: 'smooth' });
  };

  return (
    <div className="bg-jay-black text-jay-white">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[88svh] flex-col overflow-hidden border-b border-white/5 lg:min-h-[calc(100svh-4.5rem)]">
        {/* Fotografía original del hero: se conserva sin reemplazos */}
        <img
          src={betaPhoto}
          alt="Moto Beta RR enduro sobre un camino de montaña — imagen del mundo off-road"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[78%_38%] sm:object-[74%_30%] lg:object-[68%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jay-black via-jay-black/80 to-jay-black/5" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-jay-black via-jay-black/25 to-jay-black/40" aria-hidden="true" />

        <div className="container-jay relative flex flex-1 items-center py-14">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-5xl font-extrabold italic uppercase leading-[0.9] text-white sm:text-7xl lg:text-[5.5rem] xl:text-[6rem]"
            >
              Tu próxima<br />
              <span className="text-jay-red">aventura</span><br />
              empieza acá
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-5 font-display text-base font-bold uppercase tracking-[0.35em] text-white/75 sm:text-lg"
            >
              {BUSINESS.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.36 }}
              className="mt-2 text-base text-gray-300"
            >
              {BUSINESS.activity}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/motos" className="btn btn-red px-8 py-4 text-sm">
                Ver motos
                <ArrowRight size={18} />
              </Link>
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-8 py-4 text-sm">
                <Phone size={17} />
                Contactar por WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-jay-red/40 bg-black/60 px-4 py-2 backdrop-blur"
            >
              <Truck size={15} className="text-jay-red-soft" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-100">
                {BUSINESS.shippingLabel}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Franja multimarca a todo ancho, dentro del hero */}
        <div className="relative z-10 border-t border-white/20 bg-jay-red py-3">
          <div className="overflow-hidden" aria-hidden="true">
            <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span key={i} className="font-display text-lg font-extrabold italic uppercase tracking-[0.18em] text-white sm:text-xl">
                  {brand} <span className="ml-12 text-white/50">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 01 / CATEGORÍAS — BLOQUE CLARO ============ */}
      <section className="bg-white text-jay-black">
        <div className="container-jay py-16 sm:py-24">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">01</span>
                <span className="h-px w-10 bg-jay-red" />
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-black/50">Catálogo</span>
              </div>
              <h2 className="mt-3 font-display text-5xl font-extrabold uppercase italic leading-[0.88] sm:text-7xl">
                Dos formas de <span className="text-jay-red">arrancar</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-black/60">
              Motos 0 km y usadas seleccionadas. Elegí el camino que mejor se adapte a tu próxima aventura.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <Link
              to="/motos?condition=NUEVA"
              className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-jay-black p-7 text-white sm:p-10 lg:col-span-7"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)' }}
            >
              <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[13rem] font-extrabold italic leading-none text-outline sm:text-[17rem]" aria-hidden="true">0</span>
              <div className="relative">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-jay-red-soft">Catálogo 0 km</span>
                <h3 className="mt-4 font-display text-7xl font-extrabold italic leading-[0.82] sm:text-8xl">0 KM</h3>
              </div>
              <div className="relative mt-10 flex items-end justify-between gap-6">
                <p className="max-w-[15rem] text-sm text-gray-300">Motos 0 km publicadas en nuestro catálogo.</p>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-jay-red transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  <ArrowRight size={22} />
                </span>
              </div>
            </Link>

            <Link
              to="/motos?condition=USADA"
              className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden border border-black/15 bg-[#f3f3f3] p-7 text-jay-black transition-colors hover:border-jay-red sm:p-10 lg:col-span-5"
            >
              <span className="pointer-events-none absolute -bottom-10 right-0 select-none font-display text-[13rem] font-extrabold italic leading-none text-black/[0.04] sm:text-[16rem]" aria-hidden="true">U</span>
              <div className="relative">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-jay-red">Usadas seleccionadas</span>
                <h3 className="mt-4 font-display text-6xl font-extrabold italic leading-[0.85] sm:text-7xl">USA<span className="text-jay-red">DAS</span></h3>
              </div>
              <div className="relative mt-10 flex items-end justify-between gap-6">
                <p className="max-w-[15rem] text-sm text-black/60">Unidades elegidas por la agencia antes de publicarse.</p>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-jay-red group-hover:bg-jay-red group-hover:text-white" aria-hidden="true">
                  <ArrowRight size={22} />
                </span>
              </div>
            </Link>
          </div>

          <Link
            to="/motos"
            className="mt-4 flex items-center justify-between border border-black/10 px-6 py-4 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-black/70 transition-colors hover:border-jay-red hover:text-jay-red"
          >
            Ver catálogo completo <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ============ 02 / DESTACADAS ============ */}
      <section className="bg-jay-black">
        <div className="container-jay py-16 sm:py-24">
          <SectionHeading
            index="02"
            eyebrow="Selección JAY MOTOS"
            title={<>Destacadas</>}
            actionLabel="Ver todas"
            actionTo="/motos?featured=true"
          />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredError ? (
            <ErrorState compact onRetry={retry} />
          ) : featured.length === 0 ? (
            <EmptyState
              icon={<BadgeCheck size={30} />}
              code="00"
              title={<>Sin destacadas</>}
              description="Todavía no hay motos destacadas publicadas."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 03 / ÚLTIMOS INGRESOS — BLOQUE CLARO ============ */}
      <section className="bg-[#f3f3f3] text-jay-black">
        <div className="container-jay py-16 sm:py-24">
          <div className="mb-8 flex flex-col gap-5 border-t border-jay-red/60 pt-5 sm:flex-row sm:items-end sm:justify-between sm:mb-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">03</span>
                <span className="h-px w-10 bg-jay-red" />
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-black/50">Recién publicadas</span>
              </div>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase italic leading-[0.88] sm:text-6xl">
                Últimos ingresos
              </h2>
            </div>
            {!loading && !latestError && latest.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollLatest(-1)}
                  aria-label="Ver ingresos anteriores"
                  className="flex h-11 w-11 items-center justify-center border border-black/15 transition-colors hover:border-jay-red hover:text-jay-red"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollLatest(1)}
                  aria-label="Ver más ingresos"
                  className="flex h-11 w-11 items-center justify-center border border-black/15 transition-colors hover:border-jay-red hover:text-jay-red"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} tone="light" />)}
            </div>
          ) : latestError ? (
            <ErrorState compact onRetry={retry} />
          ) : latest.length === 0 ? (
            <EmptyState
              tone="light"
              icon={<SearchX size={30} />}
              code="00"
              title={<>Catálogo vacío</>}
              description="Todavía no hay motos publicadas en el catálogo."
            />
          ) : (
            <div ref={latestRef} className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
              {latest.slice(0, 4).map((bike) => (
                <div key={bike.id} className="w-[82vw] max-w-sm shrink-0 snap-start sm:w-[350px]">
                  <BikeCard bike={bike} tone="light" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 04 / ESPECIALIDAD — FOTOGRAFÍA PROTAGONISTA ============ */}
      <section className="bg-black">
        <div className="container-jay grid gap-0 py-16 sm:py-24 lg:grid-cols-12 lg:items-stretch">
          <div className="relative lg:col-span-7">
            <img
              src={ktmPhoto}
              alt="Moto de enduro en un camino de montaña"
              loading="lazy"
              className="h-full min-h-[300px] w-full object-cover object-[70%_20%] sm:min-h-[460px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-4 left-5 select-none font-display text-6xl font-extrabold italic leading-none text-outline sm:text-8xl" aria-hidden="true">RIDE</span>
          </div>
          <div className="relative bg-jay-black p-7 sm:p-10 lg:col-span-5 lg:col-start-8 lg:self-center lg:border-l-2 lg:border-jay-red lg:py-14">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">04</span>
              <span className="h-px w-10 bg-jay-red" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">Especialidad</span>
            </div>
            <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.88] text-white sm:text-6xl">
              Enduro<br /><span className="text-jay-red">& off-road</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-300">
              JAY MOTOS es una concesionaria multimarca con especial identidad en las motos enduro y off-road:
              las motos que amamos, las que conocemos y las que recomendamos. No somos una tienda generalista.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Concesionaria multimarca',
                'Especialidad en enduro y off-road',
                'Motos 0 km y usadas seleccionadas',
                BUSINESS.shippingLabel,
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-200">
                  <BadgeCheck size={18} className="shrink-0 text-jay-red" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/nosotros" className="mt-8 inline-flex items-center gap-2 border-b border-white/20 pb-1 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-white transition-colors hover:border-jay-red hover:text-jay-red">
              Sobre la agencia <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 05 / FINANCIACIÓN — BLOQUE CLARO ============ */}
      <section className="bg-white text-jay-black">
        <div className="container-jay relative py-16 sm:py-24">
          <span className="absolute -left-4 top-10 h-2 w-32 -rotate-6 bg-jay-red" aria-hidden="true" />
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">05</span>
                <span className="h-px w-10 bg-jay-red" />
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-black/50">JAY MOTOS · Comercial</span>
              </div>
              <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.85] sm:text-8xl">
                FINAN<span className="text-jay-red">CIA</span>CIÓN
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-base leading-relaxed text-black/65">
                Las opciones de financiación se consultan directamente con nosotros. Escribinos y conversamos
                sobre cada operación: las condiciones se definen caso por caso.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={buildWhatsAppLink('Hola! Quisiera consultar por las opciones de financiación disponibles en JAY MOTOS.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-red px-7 py-4 text-xs"
                >
                  <Phone size={17} /> Consultar por WhatsApp
                </a>
                <Link to="/financiacion" className="inline-flex items-center justify-center gap-2 border border-black/20 px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.2em] transition-colors hover:border-jay-red hover:text-jay-red">
                  Ver detalles <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ENVÍOS ============ */}
      <section className="diagonal-lines border-y border-white/5 bg-jay-black">
        <div className="container-jay flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-jay-red text-white sm:h-20 sm:w-20">
              <Truck size={34} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                Envíos a<br /><span className="text-jay-red">todo el país</span>
              </h2>
              <p className="mt-2 max-w-xs text-xs text-gray-400 sm:text-sm">
                Coordinamos la entrega de tu moto a cualquier punto del territorio argentino.
              </p>
            </div>
          </div>
          <a
            href={buildWhatsAppLink('Hola! Quisiera coordinar el envío de una moto a mi localidad.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost shrink-0 px-7 py-4 text-xs"
          >
            Coordinar mi envío <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ============ 06 / UBICACIÓN Y CONTACTO — BLOQUE CLARO ============ */}
      <section className="bg-[#f3f3f3] text-jay-black">
        <div className="container-jay grid gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">06</span>
              <span className="h-px w-10 bg-jay-red" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-black/50">Ubicación y contacto</span>
            </div>
            <h2 className="mt-3 font-display text-5xl font-extrabold uppercase italic leading-[0.88] sm:text-7xl">
              Vení a<br /><span className="text-jay-red">Corrientes 1440</span>
            </h2>

            <div className="mt-8 bg-jay-black p-7 text-white sm:p-8">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-jay-red" />
                  <span className="font-semibold">{BUSINESS.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck size={20} className="mt-0.5 shrink-0 text-jay-red" />
                  <span>{BUSINESS.shippingLabel}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0 text-jay-red" />
                  <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover:text-jay-red-soft">
                    {BUSINESS.phoneDisplay} <span className="text-gray-500">(WhatsApp)</span>
                  </a>
                </li>
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="btn btn-red px-6 py-4 text-xs">
                  <MapPin size={17} /> Abrir en Google Maps
                </a>
                <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 py-4 text-xs">
                  <Phone size={17} /> Escribinos ahora
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative border-4 border-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)]">
              <iframe
                title="JAY MOTOS — Corrientes 1440, Tucumán, Argentina"
                src="https://www.google.com/maps?q=Corrientes+1440+Tucuman+Argentina&output=embed"
                width="100%"
                height="420"
                className="block h-[300px] w-full sm:h-[420px] lg:h-[480px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="absolute -bottom-4 left-4 flex items-center gap-4 bg-jay-black px-5 py-3 text-white">
                <Logo className="h-8" />
                <span className="hidden font-display text-[10px] font-bold uppercase tracking-[0.3em] text-jay-red-soft sm:inline">
                  For riders, by riders.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
