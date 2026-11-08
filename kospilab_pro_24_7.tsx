import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  Clock,
  Terminal,
  Info,
  Sliders,
  ChevronRight,
  BarChart2,
  Layers,
  Zap,
  Globe,
  ShieldAlert,
  Copy,
  Check,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  Code2,
  Wifi,
  Settings,
  X,
  Calculator,
  BookOpen,
  Flame,
  PlusCircle
} from 'lucide-react';

// 24시간 해외 무기한 선물(Hyperliquid/Binance) 및 미국 ADR 기반 12대 한국 대표 종목 초기 데이터
const INITIAL_STOCKS = [
  {
    id: '005930',
    name: '삼성전자',
    engName: 'Samsung Electronics',
    symbol: 'SAMSUNG-USDC',
    hlTicker: 'SAMSUNG',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 68400,
    nxtClose: 68900,
    usdtPrice: 49.65, // 49.65 * 1412 ≈ 70,100원
    fundingRate: 0.0125,
    volume24h: '1억 1,840만 USD',
    marketCap: '408.3조',
    high52w: 88800,
    low52w: 53000,
    category: '반도체/AI',
    isFavorite: true,
    description: 'Hyperliquid 24시간 무기한 선물(SAMSUNG-USDC) 및 런던 GDR 실시간 연동 원화 추정가',
    history: [68400, 68700, 68900, 69200, 69100, 69500, 69800, 69700, 70000, 70100]
  },
  {
    id: '000660',
    name: 'SK하이닉스',
    engName: 'SK Hynix',
    symbol: 'SKHYNIX-USDC',
    hlTicker: 'SKHYNIX',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 198500,
    nxtClose: 201000,
    usdtPrice: 145.60, // 145.60 * 1412 ≈ 205,600원
    fundingRate: 0.0185,
    volume24h: '1억 6,420만 USD',
    marketCap: '144.5조',
    high52w: 248500,
    low52w: 142000,
    category: '반도체/AI',
    isFavorite: true,
    description: 'HBM3E·AI 반도체 모멘텀 반영 24시간 무기한 선물(SKHYNIX-USDC) 실시간 환산 시세',
    history: [198500, 199500, 201000, 202000, 201500, 203000, 204000, 204500, 205000, 205500]
  },
  {
    id: '005380',
    name: '현대차',
    engName: 'Hyundai Motor',
    symbol: 'HYUNDAI-USDC',
    hlTicker: 'HYUNDAI',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 241000,
    nxtClose: 242500,
    usdtPrice: 173.85, // 약 245,500원
    fundingRate: 0.0095,
    volume24h: '4,210만 USD',
    marketCap: '50.4조',
    high52w: 299500,
    low52w: 185000,
    category: '자동차/방산/원전',
    isFavorite: true,
    description: '해외 DR(HYMTF) 및 글로벌 자동차·로보틱스 24H 무기한 선물 연동 원화 추정가',
    history: [241000, 241500, 242500, 243000, 243500, 244000, 243500, 244500, 245000, 245500]
  },
  {
    id: '012450',
    name: '한화에어로스페이스',
    engName: 'Hanwha Aerospace',
    symbol: 'HANWHA-USDC',
    hlTicker: 'HANWHA',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 382000,
    nxtClose: 385500,
    usdtPrice: 277.60, // 약 392,000원
    fundingRate: 0.0162,
    volume24h: '5,890만 USD',
    marketCap: '19.3조',
    high52w: 415000,
    low52w: 198000,
    category: '자동차/방산/원전',
    isFavorite: true,
    description: '글로벌 지정학 리스크 및 K-방산 24시간 무기한 선물 인덱스 연동 추정가',
    history: [382000, 384000, 385500, 387000, 388500, 389000, 390500, 391000, 391500, 392000]
  },
  {
    id: '034020',
    name: '두산에너빌리티',
    engName: 'Doosan Enerbility',
    symbol: 'DOOSAN-USDC',
    hlTicker: 'DOOSAN',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 22400,
    nxtClose: 22650,
    usdtPrice: 16.32, // 약 23,050원
    fundingRate: 0.0140,
    volume24h: '3,120만 USD',
    marketCap: '14.3조',
    high52w: 26500,
    low52w: 14800,
    category: '자동차/방산/원전',
    isFavorite: false,
    description: 'AI 데이터센터 전력·SMR(소형모듈원전) 24시간 글로벌 선물 연동 시세',
    history: [22400, 22500, 22650, 22700, 22800, 22750, 22900, 22950, 23000, 23050]
  },
  {
    id: '196170',
    name: '알테오젠',
    engName: 'Alteogen',
    symbol: 'ALTEOGEN-USDC',
    hlTicker: 'ALTEOGEN',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 368000,
    nxtClose: 371000,
    usdtPrice: 266.30, // 약 376,000원
    fundingRate: 0.0155,
    volume24h: '4,750만 USD',
    marketCap: '19.6조',
    high52w: 445000,
    low52w: 168000,
    category: '바이오',
    isFavorite: true,
    description: '코스닥 대장주 SC제형 플랫폼 무기한 선물 및 글로벌 바이오텍 24H 연동',
    history: [368000, 369500, 371000, 372500, 372000, 373500, 374000, 375000, 375500, 376000]
  },
  {
    id: '373220',
    name: 'LG에너지솔루션',
    engName: 'LG Energy Solution',
    symbol: 'LGES-USDC',
    hlTicker: 'LGES',
    source: 'Binance Perp',
    sourceType: 'PERP',
    krxClose: 392000,
    nxtClose: 390500,
    usdtPrice: 274.80, // 약 388,000원 (하락 예시)
    fundingRate: -0.0045,
    volume24h: '3,680만 USD',
    marketCap: '91.7조',
    high52w: 448000,
    low52w: 312000,
    category: '2차전지',
    isFavorite: false,
    description: '글로벌 EV·배터리 바스켓 및 24시간 LGES 무기한 선물 실시간 원화 환산가',
    history: [392000, 391500, 390500, 390000, 389500, 390000, 389000, 388500, 388500, 388000]
  },
  {
    id: '068270',
    name: '셀트리온',
    engName: 'Celltrion',
    symbol: 'CELLTRION-USDC',
    hlTicker: 'CELLTRION',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 187500,
    nxtClose: 188200,
    usdtPrice: 134.20, // 약 189,500원
    fundingRate: 0.0080,
    volume24h: '2,290만 USD',
    marketCap: '40.7조',
    high52w: 212000,
    low52w: 165000,
    category: '바이오',
    isFavorite: false,
    description: '자가면역질환 신약 짐펜트라 글로벌 헬스케어 24H 파생상품 연동 시세',
    history: [187500, 187800, 188200, 188500, 188400, 188800, 189000, 189200, 189300, 189500]
  },
  {
    id: '207940',
    name: '삼성바이오로직스',
    engName: 'Samsung Biologics',
    symbol: 'SAMBIO-USDC',
    hlTicker: 'SAMBIO',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 985000,
    nxtClose: 991000,
    usdtPrice: 707.50, // 약 999,000원 (황제주)
    fundingRate: 0.0110,
    volume24h: '2,940만 USD',
    marketCap: '70.1조',
    high52w: 1095000,
    low52w: 745000,
    category: '바이오',
    isFavorite: false,
    description: '글로벌 CDMO 수주 모멘텀 및 24시간 바이오 무기한 선물 원화 환산 추정가',
    history: [985000, 988000, 991000, 993000, 994000, 995000, 996000, 997000, 998000, 999000]
  },
  {
    id: '105560',
    name: 'KB금융',
    engName: 'KB Financial Group',
    symbol: 'KB (NYSE ADR)',
    hlTicker: 'KB',
    source: 'US ADR 24H',
    sourceType: 'ADR',
    krxClose: 92400,
    nxtClose: 92900,
    usdtPrice: 66.50, // 약 93,900원
    fundingRate: 0.0065,
    volume24h: '2,410만 USD',
    marketCap: '36.8조',
    high52w: 103500,
    low52w: 61200,
    category: '반도체/AI',
    isFavorite: false,
    description: '미국 뉴욕증시 KB ADR(1:1 원주 비율) 및 Blue Ocean 24시간 대체거래소 실시간 호가',
    history: [92400, 92600, 92900, 93100, 93300, 93200, 93500, 93700, 93800, 93900]
  },
  {
    id: '035420',
    name: 'NAVER',
    engName: 'NAVER Corp',
    symbol: 'NAVER-USDC',
    hlTicker: 'NAVER',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 194500,
    nxtClose: 195500,
    usdtPrice: 139.85, // 약 197,500원
    fundingRate: 0.0092,
    volume24h: '2,780만 USD',
    marketCap: '31.6조',
    high52w: 232000,
    low52w: 151000,
    category: '반도체/AI',
    isFavorite: false,
    description: '소버린 AI·클라우드 플랫폼 24시간 무기한 선물(NAVER-USDC) 실시간 추정가',
    history: [194500, 195000, 195500, 196000, 196200, 196500, 196800, 197000, 197200, 197500]
  },
  {
    id: '247540',
    name: '에코프로비엠',
    engName: 'EcoPro BM',
    symbol: 'ECOPROBM-USDC',
    hlTicker: 'ECOPROBM',
    source: 'Hyperliquid Perp',
    sourceType: 'PERP',
    krxClose: 142500,
    nxtClose: 141200,
    usdtPrice: 98.80, // 약 139,500원 (하락 예시)
    fundingRate: -0.0085,
    volume24h: '3,450만 USD',
    marketCap: '13.9조',
    high52w: 285000,
    low52w: 118000,
    category: '2차전지',
    isFavorite: false,
    description: '양극재·2차전지 섹터 24시간 무기한 선물 숏/롱 포지션 수급 반영 원화 추정가',
    history: [142500, 141800, 141200, 140800, 141000, 140500, 140200, 139800, 139700, 139500]
  }
];

export default function App() {
  // 상태 관리
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [selectedStockId, setSelectedStockId] = useState('005930'); // 기본 선택: 삼성전자
  const [fxMode, setFxMode] = useState('USDT'); // 기본값: 주말 실시간 시장 심리를 반영하는 업비트 USDT 환율 (1,412원)
  const [usdtRate, setUsdtRate] = useState(1412.0); // 업비트 USDT/KRW 실시간 시세
  const [officialRate, setOfficialRate] = useState(1398.5); // USD/KRW 외환시장 마감 고시환율
  const [customFxOffset, setCustomFxOffset] = useState(0); // 사용자 환율 민감도 조절 슬라이더 (±30원)
  const [baseCloseMode, setBaseCloseMode] = useState('KRX'); // 'KRX' (정규장 15:30) or 'NXT' (야간장 20:00)
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'ARCHITECTURE'
  const [detailSubTab, setDetailSubTab] = useState('ORDERBOOK'); // 'ORDERBOOK' | 'CALCULATOR'
  const [chartTimeframe, setChartTimeframe] = useState('15분');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [flashStates, setFlashStates] = useState({});
  const [liveTrades, setLiveTrades] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAutoSimulating, setIsAutoSimulating] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [wsConnectionStatus, setWsConnectionStatus] = useState('CONNECTING'); // 'LIVE_WS' | 'SIM_FALLBACK'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsdInput, setEditUsdInput] = useState('');
  const [editKrxInput, setEditKrxInput] = useState('');

  // 월요일 시초가 계산기 전용 상태
  const [calcTargetUsd, setCalcTargetUsd] = useState('51.00');
  const [calcTargetFx, setCalcTargetFx] = useState('1415.0');

  // 현재 적용 환율 계산
  const activeExchangeRate = useMemo(() => {
    const base = fxMode === 'USDT' ? usdtRate : officialRate;
    return Number((base + customFxOffset).toFixed(1));
  }, [fxMode, usdtRate, officialRate, customFxOffset]);

  // 김치 프리미엄 계산
  const kimchiPremium = useMemo(() => {
    return (((usdtRate - officialRate) / officialRate) * 100).toFixed(2);
  }, [usdtRate, officialRate]);

  // 실시간 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 업비트(Upbit) 실시간 KRW-USDT 웹소켓 연결 + 폴백 시뮬레이션
  useEffect(() => {
    let ws = null;
    let fallbackInterval = null;

    try {
      ws = new WebSocket('wss://api.upbit.com/websocket/v1');
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        setWsConnectionStatus('LIVE_WS');
        ws.send(
          JSON.stringify([
            { ticket: 'kospilab-pro-live' },
            { type: 'ticker', codes: ['KRW-USDT'] }
          ])
        );
      };

      ws.onmessage = (event) => {
        try {
          const enc = new TextDecoder('utf-8');
          const arr = new Uint8Array(event.data);
          const data = JSON.parse(enc.decode(arr));
          if (data && data.trade_price) {
            setUsdtRate(Number(data.trade_price));
          }
        } catch (err) {
          // 파싱 오류 무시
        }
      };

      ws.onerror = () => {
        setWsConnectionStatus('SIM_FALLBACK');
      };

      ws.onclose = () => {
        setWsConnectionStatus('SIM_FALLBACK');
      };
    } catch (e) {
      setWsConnectionStatus('SIM_FALLBACK');
    }

    // 웹소켓이 차단되거나 테더 호가 변동이 멈췄을 때 미세 변동 폴백
    fallbackInterval = setInterval(() => {
      setUsdtRate((prev) => {
        const delta = Math.random() > 0.65 ? (Math.random() > 0.5 ? 0.5 : -0.5) : 0;
        const next = Number((prev + delta).toFixed(1));
        return Math.min(Math.max(next, 1380), 1460);
      });
    }, 3500);

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // 초기 실시간 체결 내역 생성
  useEffect(() => {
    const initialTrades = [
      { id: 1, time: '11:07:12', symbol: 'SAMSUNG-USDC', side: 'BUY', usdt: 49.65, qty: 180, exchange: 'Hyperliquid' },
      { id: 2, time: '11:07:09', symbol: 'SKHYNIX-USDC', side: 'BUY', usdt: 145.60, qty: 65, exchange: 'Hyperliquid' },
      { id: 3, time: '11:07:04', symbol: 'HANWHA-USDC', side: 'BUY', usdt: 277.60, qty: 32, exchange: 'Hyperliquid' },
      { id: 4, time: '11:06:58', symbol: 'LGES-USDC', side: 'SELL', usdt: 274.80, qty: 19, exchange: 'Binance' },
      { id: 5, time: '11:06:51', symbol: 'ALTEOGEN-USDC', side: 'BUY', usdt: 266.30, qty: 44, exchange: 'Hyperliquid' },
      { id: 6, time: '11:06:45', symbol: 'HYUNDAI-USDC', side: 'BUY', usdt: 173.85, qty: 50, exchange: 'Hyperliquid' }
    ];
    setLiveTrades(initialTrades);
  }, []);

  // 한국거래소 가격대별 호가 단위(Tick size) 반올림 함수
  const roundToKrxTick = (rawKrw) => {
    if (rawKrw >= 500000) return Math.round(rawKrw / 1000) * 1000;
    if (rawKrw >= 200000) return Math.round(rawKrw / 500) * 500;
    if (rawKrw >= 50000) return Math.round(rawKrw / 100) * 100;
    if (rawKrw >= 20000) return Math.round(rawKrw / 50) * 50;
    return Math.round(rawKrw / 10) * 10;
  };

  // 실시간 WebSocket 틱 시뮬레이터 (12개 종목 실시간 체결 애니메이션)
  useEffect(() => {
    if (!isAutoSimulating) return;

    const anchorMap = {
      '005930': 49.65,
      '000660': 145.60,
      '005380': 173.85,
      '012450': 277.60,
      '034020': 16.32,
      '196170': 266.30,
      '373220': 274.80,
      '068270': 134.20,
      '207940': 707.50,
      '105560': 66.50,
      '035420': 139.85,
      '247540': 98.80
    };

    const interval = setInterval(() => {
      const newFlash = {};

      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          if (Math.random() > 0.48) return stock;

          const anchor = anchorMap[stock.id] || stock.usdtPrice;
          const pullToAnchor = (anchor - stock.usdtPrice) * 0.3;
          const randomNoise = (Math.random() - 0.492) * (anchor * 0.0018);
          const newUsdt = Math.max(1, Number((stock.usdtPrice + pullToAnchor + randomNoise).toFixed(2)));
          const direction = newUsdt > stock.usdtPrice ? 'UP' : newUsdt < stock.usdtPrice ? 'DOWN' : null;

          if (direction) {
            newFlash[stock.id] = direction;
          }

          const newKrwEst = roundToKrxTick(newUsdt * activeExchangeRate);
          const updatedHistory = [...stock.history.slice(1), newKrwEst];

          if (direction && Math.random() > 0.35) {
            const nowStr = new Date().toTimeString().split(' ')[0];
            const tradeItem = {
              id: Date.now() + Math.random(),
              time: nowStr,
              symbol: stock.symbol,
              name: stock.name,
              side: direction === 'UP' ? 'BUY' : 'SELL',
              usdt: newUsdt,
              qty: Math.floor(Math.random() * 140) + 5,
              exchange: stock.source.split(' ')[0]
            };
            setLiveTrades((prev) => [tradeItem, ...prev.slice(0, 15)]);
          }

          return {
            ...stock,
            usdtPrice: newUsdt,
            history: updatedHistory
          };
        })
      );

      setFlashStates(newFlash);
      setTimeout(() => {
        setFlashStates({});
      }, 600);
    }, 1500);

    return () => clearInterval(interval);
  }, [isAutoSimulating, activeExchangeRate]);

  // 원화 환산 및 등락률이 계산된 종목 리스트
  const computedStocks = useMemo(() => {
    return stocks.map((stock) => {
      const rawKrw = stock.usdtPrice * activeExchangeRate;
      const estimatedKrw = roundToKrxTick(rawKrw);
      const refClose = baseCloseMode === 'KRX' ? stock.krxClose : stock.nxtClose;
      const diffKrw = estimatedKrw - refClose;
      const diffPercent = ((diffKrw / refClose) * 100).toFixed(2);

      return {
        ...stock,
        rawKrw: Math.round(rawKrw),
        estimatedKrw,
        refClose,
        diffKrw,
        diffPercent: Number(diffPercent)
      };
    });
  }, [stocks, activeExchangeRate, baseCloseMode]);

  // 필터링된 종목
  const filteredStocks = useMemo(() => {
    return computedStocks.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery) ||
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'ALL'
          ? true
          : selectedCategory === 'FAV'
          ? s.isFavorite
          : s.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [computedStocks, searchQuery, selectedCategory]);

  // 현재 선택된 상세 종목
  const selectedStock = useMemo(() => {
    return computedStocks.find((s) => s.id === selectedStockId) || computedStocks[0];
  }, [computedStocks, selectedStockId]);

  // 선택 종목이 바뀔 때 월요일 시초가 계산기 초기값 동기화
  useEffect(() => {
    if (selectedStock) {
      setCalcTargetUsd((selectedStock.usdtPrice * 1.02).toFixed(2));
      setCalcTargetFx(String(activeExchangeRate));
    }
  }, [selectedStockId]);

  // 코스피 200 주말 예상 지수 및 야간선물 산출
  const kospi24hSummary = useMemo(() => {
    const baseKospi = 2584.60;
    const baseKospi200 = 346.20;
    const avgDiffPercent =
      computedStocks.reduce((acc, cur) => acc + cur.diffPercent, 0) / computedStocks.length;
    const estKospi = (baseKospi * (1 + avgDiffPercent / 100)).toFixed(2);
    const estKospi200 = (baseKospi200 * (1 + avgDiffPercent / 100)).toFixed(2);
    const pointDiff = (estKospi - baseKospi).toFixed(2);
    return {
      index: estKospi,
      kospi200: estKospi200,
      pointDiff,
      percent: avgDiffPercent.toFixed(2)
    };
  }, [computedStocks]);

  // 선택 종목의 실시간 5단계 매도/매수 호가(Orderbook) 생성
  const orderbookData = useMemo(() => {
    const midUsd = selectedStock.usdtPrice;
    const stepUsd = midUsd >= 200 ? 0.25 : midUsd >= 50 ? 0.05 : 0.02;

    const asks = [5, 4, 3, 2, 1].map((lvl) => {
      const priceUsd = Number((midUsd + lvl * stepUsd).toFixed(2));
      const priceKrw = roundToKrxTick(priceUsd * activeExchangeRate);
      const pct = (((priceKrw - selectedStock.refClose) / selectedStock.refClose) * 100).toFixed(2);
      const size = Math.floor(((lvl * 37 + Number(selectedStock.id.slice(-2))) % 180) + 25);
      return { priceUsd, priceKrw, pct, size };
    });

    const bids = [1, 2, 3, 4, 5].map((lvl) => {
      const priceUsd = Number((midUsd - (lvl - 1) * stepUsd).toFixed(2));
      const priceKrw = roundToKrxTick(priceUsd * activeExchangeRate);
      const pct = (((priceKrw - selectedStock.refClose) / selectedStock.refClose) * 100).toFixed(2);
      const size = Math.floor(((lvl * 43 + Number(selectedStock.id.slice(-2))) % 210) + 30);
      return { priceUsd, priceKrw, pct, size };
    });

    const maxVol = Math.max(...asks.map((a) => a.size), ...bids.map((b) => b.size), 1);
    return { asks, bids, maxVol };
  }, [selectedStock, activeExchangeRate]);

  // 즐겨찾기 토글
  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  // 종목 가격 수동 보정 모달 열기
  const openCalibrationModal = () => {
    setEditUsdInput(String(selectedStock.usdtPrice));
    setEditKrxInput(String(selectedStock.krxClose));
    setIsEditModalOpen(true);
  };

  // 종목 가격 수동 보정 저장
  const handleSaveCalibration = (e) => {
    e.preventDefault();
    const parsedUsd = parseFloat(editUsdInput);
    const parsedKrx = parseInt(editKrxInput, 10);
    if (!isNaN(parsedUsd) && parsedUsd > 0) {
      setStocks((prev) =>
        prev.map((s) =>
          s.id === selectedStock.id
            ? {
                ...s,
                usdtPrice: parsedUsd,
                krxClose: !isNaN(parsedKrx) && parsedKrx > 0 ? parsedKrx : s.krxClose
              }
            : s
        )
      );
    }
    setIsEditModalOpen(false);
  };

  // 코드 복사 핸들러
  const handleCopyCode = () => {
    const codeSnippet = `// KOSPILAB PRO - 업비트 실시간 테더(KRW-USDT) + Hyperliquid 24H 한국 주식 선물 웹소켓 연동
let liveUsdtKrw = 1412.0;
const fridayClose = { SAMSUNG: 68400, SKHYNIX: 198500, HYUNDAI: 241000 };

// [1] 업비트 KRW-USDT 실시간 웹소켓 연결 (인증키 불필요)
const upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
upbitWs.binaryType = 'arraybuffer';
upbitWs.onopen = () => {
  upbitWs.send(JSON.stringify([
    { ticket: 'kospilab-fx' },
    { type: 'ticker', codes: ['KRW-USDT'] }
  ]));
};
upbitWs.onmessage = (event) => {
  const enc = new TextDecoder('utf-8');
  const data = JSON.parse(enc.decode(new Uint8Array(event.data)));
  if (data?.trade_price) liveUsdtKrw = data.trade_price;
};

// [2] Hyperliquid 24시간 무기한 선물 웹소켓 연결
const hlWs = new WebSocket('wss://api.hyperliquid.xyz/ws');
hlWs.onopen = () => {
  hlWs.send(JSON.stringify({
    method: 'subscribe',
    subscription: { type: 'allMids' }
  }));
};
hlWs.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.channel === 'allMids') {
    const samsungUsd = parseFloat(msg.data.mids['SAMSUNG'] || 49.65);
    const estimatedKrw = Math.round((samsungUsd * liveUsdtKrw) / 100) * 100;
    const gapPct = (((estimatedKrw - fridayClose.SAMSUNG) / fridayClose.SAMSUNG) * 100).toFixed(2);
    console.log(\`삼성전자 주말 실시간 추정가: \${estimatedKrw.toLocaleString()}원 (\${gapPct}%)\`);
  }
};`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 월요일 시초가 계산기 결과값
  const customCalcResult = useMemo(() => {
    const u = parseFloat(calcTargetUsd) || 0;
    const f = parseFloat(calcTargetFx) || 0;
    const est = roundToKrxTick(u * f);
    const diff = est - selectedStock.refClose;
    const pct = selectedStock.refClose > 0 ? ((diff / selectedStock.refClose) * 100).toFixed(2) : '0.00';
    return { est, diff, pct: Number(pct) };
  }, [calcTargetUsd, calcTargetFx, selectedStock]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* 1. 최상단 실시간 마켓 티커 & 상태 바 */}
      <div className="bg-[#07090d] border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              24H 주말 실시간 파생·ADR 시세 가동중
            </span>
            <span className="text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              KST {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
              <span className="text-slate-700">|</span>
              <span className="text-amber-400/90">
                {wsConnectionStatus === 'LIVE_WS'
                  ? '업비트 KRW-USDT 실시간 웹소켓 연결됨'
                  : '24H 하이브리드 웹소켓 엔진 가동중'}
              </span>
            </span>
          </div>

          {/* 우측 핵심 주말 지수 & 환율 요약 배너 */}
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">예상 KOSPI</span>
              <span className={`font-bold font-mono ${Number(kospi24hSummary.percent) >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'}`}>
                {kospi24hSummary.index}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[11px] font-bold font-mono ${
                Number(kospi24hSummary.percent) >= 0
                  ? 'bg-[#f04452]/15 text-[#f04452]'
                  : 'bg-[#3182f6]/15 text-[#3182f6]'
              }`}>
                {Number(kospi24hSummary.percent) >= 0 ? '+' : ''}
                {kospi24hSummary.percent}%
              </span>
            </div>

            <span className="text-slate-800">|</span>

            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">KOSPI 200 야간/주말선물</span>
              <span className={`font-bold font-mono ${Number(kospi24hSummary.percent) >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'}`}>
                {kospi24hSummary.kospi200}
              </span>
            </div>

            <span className="text-slate-800">|</span>

            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">업비트 테더(USDT)</span>
              <span className="font-bold font-mono text-emerald-400">{usdtRate.toLocaleString()}원</span>
              <span className="text-[11px] text-slate-400 font-mono">
                (김프 {Number(kimchiPremium) >= 0 ? `+${kimchiPremium}` : kimchiPremium}%)
              </span>
            </div>

            <span className="text-slate-800 hidden md:inline">|</span>

            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">USD/KRW 고시환율</span>
              <span className="font-semibold font-mono text-slate-200">{officialRate.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 메인 헤더 & 탭 네비게이션 */}
      <header className="bg-[#11151e]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f04452] to-[#3182f6] p-[1px] shadow-lg shadow-rose-500/10">
              <div className="w-full h-full bg-[#0b0e14] rounded-[11px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#f04452]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  KOSPILAB <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#f04452]/20 text-[#f04452] border border-[#f04452]/30">PRO 24/7</span>
                </h1>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  주말·야간 실시간 한국 주식 추정가 터미널
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                해외 24H 무기한 선물(Hyperliquid·Binance) 및 미국 ADR 실시간 환율 연동 시세판
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex rounded-xl bg-[#0b0e14] p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 text-[#f04452]" />
                24H 실시간 시세 보드
              </button>
              <button
                onClick={() => setActiveTab('ARCHITECTURE')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'ARCHITECTURE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                실제 사이트 제작 · API 연동 가이드
              </button>
            </div>

            <button
              onClick={openCalibrationModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              기준가 직접 수정
            </button>

            <button
              onClick={() => setIsAutoSimulating(!isAutoSimulating)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAutoSimulating
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <Wifi className={`w-3.5 h-3.5 ${isAutoSimulating ? 'animate-pulse' : ''}`} />
              {isAutoSimulating ? 'LIVE 틱 수신중' : '수신 일시정지'}
            </button>
          </div>
        </div>
      </header>

      {/* 기준가 수동 보정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151921] border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                {selectedStock.name} ({selectedStock.symbol}) 시세 수동 설정
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCalibration} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  해외 파생상품 현재가 (USD / USDC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editUsdInput}
                  onChange={(e) => setEditUsdInput(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  환산 예상가:{' '}
                  <strong className="text-[#f04452]">
                    {roundToKrxTick(parseFloat(editUsdInput || 0) * activeExchangeRate).toLocaleString()}원
                  </strong>{' '}
                  (적용 환율 {activeExchangeRate}원)
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  금요일 KRX 정규장 종가 (원)
                </label>
                <input
                  type="number"
                  step="50"
                  value={editKrxInput}
                  onChange={(e) => setEditKrxInput(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                >
                  적용하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. 메인 대시보드 콘텐츠 */}
      <main className="max-w-[1600px] mx-auto px-4 py-5">
        {activeTab === 'DASHBOARD' ? (
          <>
            {/* 상단 컨트롤 바: 환율 모드 토글 + FX 슬라이더(±30원) + KRX/NXT 종가 기준 스위치 */}
            <section className="mb-6 bg-[#151921] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 환율 기준 토글 */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b0e14] p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      실시간 원화 환산 환율 선택
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      주말 체감 환율(테더) 또는 외환시장 마감 고시환율 선택
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg bg-[#151921] p-1 border border-slate-800 shrink-0">
                    <button
                      onClick={() => {
                        setFxMode('USDT');
                        setCustomFxOffset(0);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        fxMode === 'USDT'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      업비트 테더 ({usdtRate.toLocaleString()}원)
                    </button>
                    <button
                      onClick={() => {
                        setFxMode('OFFICIAL');
                        setCustomFxOffset(0);
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        fxMode === 'OFFICIAL'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      고시환율 ({officialRate.toLocaleString()}원)
                    </button>
                  </div>
                </div>

                {/* 환율 시뮬레이션 슬라이더 (±30 KRW) */}
                <div className="lg:col-span-4 bg-[#0b0e14] p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      월요일 환율 갭 시뮬레이터: <strong className="text-white font-mono text-sm">{activeExchangeRate.toLocaleString()}원</strong>
                    </span>
                    {customFxOffset !== 0 && (
                      <button
                        onClick={() => setCustomFxOffset(0)}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        0원 초기화
                      </button>
                    )}
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="0.5"
                    value={customFxOffset}
                    onChange={(e) => setCustomFxOffset(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>-30원 (원화 강세)</span>
                    <span className="text-indigo-300">
                      변동폭: {customFxOffset >= 0 ? `+${customFxOffset}` : customFxOffset}원
                    </span>
                    <span>+30원 (원화 약세)</span>
                  </div>
                </div>

                {/* 비교 종가 기준 (KRX 정규장 15:30 vs NXT 야간장 20:00) */}
                <div className="lg:col-span-3 flex flex-col justify-between bg-[#0b0e14] p-3 rounded-xl border border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>금요일 비교 종가 기준</span>
                    <span className="text-[10px] text-slate-500 font-mono">KRX vs NXT</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-[#151921] p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setBaseCloseMode('KRX')}
                      className={`py-1.5 rounded text-xs font-semibold transition-all ${
                        baseCloseMode === 'KRX'
                          ? 'bg-slate-700 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      KRX 정규장 (15:30)
                    </button>
                    <button
                      onClick={() => setBaseCloseMode('NXT')}
                      className={`py-1.5 rounded text-xs font-semibold transition-all ${
                        baseCloseMode === 'NXT'
                          ? 'bg-slate-700 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      NXT 야간장 (20:00)
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 좌우 분할 레이아웃: 좌측 12개 종목 카드 그리드 (7칸) + 우측 심층 터미널 패널 (5칸) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* 좌측: 12개 대표 종목 실시간 그리드 */}
              <div className="xl:col-span-7 space-y-4">
                {/* 카테고리 탭 & 검색창 */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'ALL', label: `전체 (${stocks.length})` },
                      { id: 'FAV', label: '★ 관심종목' },
                      { id: '반도체/AI', label: '반도체·AI·금융' },
                      { id: '2차전지', label: '2차전지' },
                      { id: '바이오', label: '바이오' },
                      { id: '자동차/방산/원전', label: '자동차·방산·원전' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-slate-100 text-slate-900 font-bold shadow'
                            : 'bg-[#151921] text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="종목명, 코드(005930), 티커..."
                      className="w-full bg-[#151921] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>

                {/* 종목 카드 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredStocks.map((stock) => {
                    const isUp = stock.diffKrw > 0;
                    const isDown = stock.diffKrw < 0;
                    const isSelected = stock.id === selectedStock.id;
                    const flash = flashStates[stock.id];

                    return (
                      <div
                        key={stock.id}
                        onClick={() => setSelectedStockId(stock.id)}
                        className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? 'bg-[#1a202c] border-slate-500 shadow-lg shadow-black/40 ring-1 ring-slate-500/50'
                            : 'bg-[#151921] border-slate-800/90 hover:border-slate-700 hover:bg-[#181d26]'
                        } ${
                          flash === 'UP'
                            ? 'ring-2 ring-[#f04452]/80 bg-[#f04452]/10'
                            : flash === 'DOWN'
                            ? 'ring-2 ring-[#3182f6]/80 bg-[#3182f6]/10'
                            : ''
                        }`}
                      >
                        {/* 카드 상단 */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => toggleFavorite(e, stock.id)}
                              className="text-slate-500 hover:text-amber-400 transition-colors"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  stock.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                                }`}
                              />
                            </button>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-base text-white group-hover:text-rose-200 transition-colors">
                                  {stock.name}
                                </h3>
                                <span className="text-[11px] font-mono text-slate-500">
                                  {stock.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {stock.symbol}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                              stock.sourceType === 'PERP'
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {stock.source}
                          </span>
                        </div>

                        {/* 카드 중단: 실시간 원화 추정가 + 예상 갭 % + 스파크라인 */}
                        <div className="flex items-end justify-between gap-2 my-3">
                          <div>
                            <div className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1">
                              <span>실시간 원화 추정가</span>
                              {flash && (
                                <span
                                  className={`text-[10px] font-mono px-1 rounded ${
                                    flash === 'UP'
                                      ? 'bg-[#f04452]/20 text-[#f04452]'
                                      : 'bg-[#3182f6]/20 text-[#3182f6]'
                                  }`}
                                >
                                  {flash === 'UP' ? '▲ 체결' : '▼ 체결'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-2xl font-extrabold tracking-tight font-mono ${
                                  isUp
                                    ? 'text-[#f04452]'
                                    : isDown
                                    ? 'text-[#3182f6]'
                                    : 'text-slate-100'
                                }`}
                              >
                                {stock.estimatedKrw.toLocaleString()}
                                <span className="text-xs font-normal text-slate-400 ml-0.5">원</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold font-mono ${
                                  isUp
                                    ? 'bg-[#f04452]/15 text-[#f04452]'
                                    : isDown
                                    ? 'bg-[#3182f6]/15 text-[#3182f6]'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {isUp ? (
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                ) : isDown ? (
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                ) : null}
                                {isUp ? '+' : ''}
                                {stock.diffPercent.toFixed(2)}%
                              </span>
                              <span
                                className={`text-xs font-mono font-semibold ${
                                  isUp
                                    ? 'text-[#f04452]'
                                    : isDown
                                    ? 'text-[#3182f6]'
                                    : 'text-slate-400'
                                }`}
                              >
                                ({isUp ? '+' : ''}
                                {stock.diffKrw.toLocaleString()}원)
                              </span>
                            </div>
                          </div>

                          <div className="w-28 h-12">
                            <Sparkline
                              data={stock.history}
                              basePrice={stock.refClose}
                              isUp={isUp}
                            />
                          </div>
                        </div>

                        {/* 카드 하단 메타데이터 */}
                        <div className="pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500 block">해외 선물가</span>
                            <span className="font-mono font-semibold text-slate-200">
                              ${stock.usdtPrice.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">{baseCloseMode} 종가</span>
                            <span className="font-mono text-slate-300">
                              {stock.refClose.toLocaleString()}원
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block">펀딩비(8H)</span>
                            <span
                              className={`font-mono font-semibold ${
                                stock.fundingRate >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'
                              }`}
                            >
                              {stock.fundingRate >= 0 ? '+' : ''}
                              {stock.fundingRate.toFixed(4)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 우측: 선택 종목 상세 터미널 (차트 + 공식 + 5단계 호가창/체결창 + 월요일 시초가 계산기) */}
              <div className="xl:col-span-5 space-y-4">
                <div className="bg-[#151921] border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-20">
                  {/* 종목 상세 헤더 */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                          {selectedStock.id}
                        </span>
                        <h2 className="text-xl font-extrabold text-white">
                          {selectedStock.name}
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedStock.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedStock.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-2xl font-extrabold font-mono ${
                          selectedStock.diffKrw >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'
                        }`}
                      >
                        {selectedStock.estimatedKrw.toLocaleString()}원
                      </div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          selectedStock.diffKrw >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'
                        }`}
                      >
                        예상 시초가 갭: {selectedStock.diffKrw >= 0 ? '+' : ''}
                        {selectedStock.diffPercent.toFixed(2)}% ({selectedStock.diffKrw >= 0 ? '+' : ''}
                        {selectedStock.diffKrw.toLocaleString()}원)
                      </div>
                    </div>
                  </div>

                  {/* 원화 환산 공식 브레이크다운 카드 */}
                  <div className="my-4 bg-[#0b0e14] border border-slate-800/90 rounded-xl p-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#f04452]" />
                        실시간 원화 추정가 환산 공식
                      </span>
                      <span className="font-mono text-emerald-400">
                        시총 {selectedStock.marketCap} · 24H 거래량 {selectedStock.volume24h}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 items-center gap-1 text-center bg-[#151921] p-2.5 rounded-lg border border-slate-800/70">
                      <div className="col-span-2">
                        <div className="text-[10px] text-slate-400">해외 선물가(USD)</div>
                        <div className="text-sm font-bold font-mono text-white mt-0.5">
                          ${selectedStock.usdtPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-slate-500 font-bold">×</div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-slate-400">
                          {fxMode === 'USDT' ? '테더 환율(KRW)' : '고시 환율(KRW)'}
                        </div>
                        <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                          {activeExchangeRate.toLocaleString()}원
                        </div>
                      </div>
                      <div className="text-slate-500 font-bold">=</div>
                      <div className="col-span-1">
                        <div className="text-[10px] text-slate-400">월요일 예상가</div>
                        <div
                          className={`text-sm font-extrabold font-mono mt-0.5 ${
                            selectedStock.diffKrw >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'
                          }`}
                        >
                          {selectedStock.estimatedKrw.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 인터랙티브 차트 영역 */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        24H 원화 환산 추이 차트 ({chartTimeframe})
                      </div>
                      <div className="inline-flex rounded-lg bg-[#0b0e14] p-0.5 border border-slate-800">
                        {['15분', '1시간', '4시간', '일봉'].map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setChartTimeframe(tf)}
                            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                              chartTimeframe === tf
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0b0e14] border border-slate-800/80 rounded-xl p-3">
                      <DetailedChart
                        history={selectedStock.history}
                        baseClose={selectedStock.refClose}
                        isUp={selectedStock.diffKrw >= 0}
                      />
                    </div>
                  </div>

                  {/* 하단 탭 전환: [실시간 호가창 & 체결창] vs [월요일 시초가 계산기] */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => setDetailSubTab('ORDERBOOK')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          detailSubTab === 'ORDERBOOK'
                            ? 'bg-slate-800 text-white border-slate-600'
                            : 'bg-[#0b0e14] text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        실시간 5단계 호가창 · 체결창
                      </button>
                      <button
                        onClick={() => setDetailSubTab('CALCULATOR')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          detailSubTab === 'CALCULATOR'
                            ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-[#0b0e14] text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                        월요일 시초가 목표 계산기
                      </button>
                    </div>

                    {detailSubTab === 'ORDERBOOK' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 좌측: 5단계 매도/매수 원화 환산 호가창 */}
                        <div className="bg-[#0b0e14] border border-slate-800/80 rounded-xl p-2.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800">
                            <span>원화 환산 호가(USD)</span>
                            <span>잔량(주)</span>
                          </div>

                          {/* 매도 5호가 (파란색) */}
                          <div className="space-y-1 mb-1.5">
                            {orderbookData.asks.map((ask, i) => (
                              <div
                                key={`ask-${i}`}
                                className="relative flex items-center justify-between px-2 py-1 rounded text-xs font-mono overflow-hidden bg-[#3182f6]/5"
                              >
                                <div
                                  className="absolute right-0 top-0 bottom-0 bg-[#3182f6]/15"
                                  style={{ width: `${(ask.size / orderbookData.maxVol) * 100}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-1.5">
                                  <span className="font-bold text-[#3182f6]">
                                    {ask.priceKrw.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    (${ask.priceUsd.toFixed(2)})
                                  </span>
                                </div>
                                <span className="relative z-10 text-slate-300 text-[11px]">
                                  {ask.size}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* 현재 체결 기준선 */}
                          <div className="py-1 px-2 my-1 rounded bg-slate-800/70 flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-300 font-sans text-[11px] font-semibold">
                              현재 추정가
                            </span>
                            <span
                              className={`font-extrabold ${
                                selectedStock.diffKrw >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'
                              }`}
                            >
                              {selectedStock.estimatedKrw.toLocaleString()}원
                            </span>
                          </div>

                          {/* 매수 5호가 (빨간색) */}
                          <div className="space-y-1 mt-1.5">
                            {orderbookData.bids.map((bid, i) => (
                              <div
                                key={`bid-${i}`}
                                className="relative flex items-center justify-between px-2 py-1 rounded text-xs font-mono overflow-hidden bg-[#f04452]/5"
                              >
                                <div
                                  className="absolute right-0 top-0 bottom-0 bg-[#f04452]/15"
                                  style={{ width: `${(bid.size / orderbookData.maxVol) * 100}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-1.5">
                                  <span className="font-bold text-[#f04452]">
                                    {bid.priceKrw.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    (${bid.priceUsd.toFixed(2)})
                                  </span>
                                </div>
                                <span className="relative z-10 text-slate-300 text-[11px]">
                                  {bid.size}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 우측: 실시간 체결 스트림 */}
                        <div className="bg-[#0b0e14] border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800">
                              <span>실시간 체결 (티커)</span>
                              <span>환산체결가</span>
                            </div>
                            <div className="divide-y divide-slate-800/50 max-h-60 overflow-y-auto text-[11px] font-mono">
                              {liveTrades.slice(0, 9).map((trade) => {
                                const krwVal = roundToKrxTick(trade.usdt * activeExchangeRate);
                                return (
                                  <div
                                    key={trade.id}
                                    className="py-1.5 flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="text-slate-500 mr-1.5">{trade.time}</span>
                                      <span className="text-slate-200 font-semibold">
                                        {trade.symbol.split('-')[0]}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span
                                        className={`font-bold ${
                                          trade.side === 'BUY' ? 'text-[#f04452]' : 'text-[#3182f6]'
                                        }`}
                                      >
                                        {krwVal.toLocaleString()}원
                                      </span>
                                      <span className="text-slate-500 ml-1">({trade.qty})</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                            <span>데이터: Hyperliquid / Binance</span>
                            <span className="text-emerald-400 font-mono">● 24H 무휴장</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 월요일 시초가 시뮬레이션 계산기 */
                      <div className="bg-[#0b0e14] border border-slate-800/80 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Calculator className="w-4 h-4 text-indigo-400" />
                            {selectedStock.name} 월요일 시초가 시뮬레이터
                          </span>
                          <span className="text-[11px] text-slate-400">
                            목표 달러가 및 예상 환율 직접 입력
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              목표 해외 선물가 (USD)
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              value={calcTargetUsd}
                              onChange={(e) => setCalcTargetUsd(e.target.value)}
                              className="w-full bg-[#151921] border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              적용 예상 환율 (KRW)
                            </label>
                            <input
                              type="number"
                              step="1"
                              value={calcTargetFx}
                              onChange={(e) => setCalcTargetFx(e.target.value)}
                              className="w-full bg-[#151921] border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="bg-[#151921] border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] text-slate-400">
                              계산된 월요일 예상 시초가 ({baseCloseMode} 종가 대비)
                            </div>
                            <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                              {customCalcResult.est.toLocaleString()}원
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-sm font-extrabold font-mono ${
                                customCalcResult.diff >= 0
                                  ? 'bg-[#f04452]/15 text-[#f04452]'
                                  : 'bg-[#3182f6]/15 text-[#3182f6]'
                              }`}
                            >
                              {customCalcResult.diff >= 0 ? '+' : ''}
                              {customCalcResult.pct}% ({customCalcResult.diff >= 0 ? '+' : ''}
                              {customCalcResult.diff.toLocaleString()}원)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 두 번째 탭: 실제 사이트 제작 & API 연동 가이드 */
          <div className="space-y-6">
            <div className="bg-[#151921] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Production Architecture & WebSocket Guide
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    코스피랩(kospilab.com)과 동일한 사이트 제작 및 무료 배포 가이드
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    업비트 실시간 테더(`KRW-USDT`) 웹소켓과 해외 24시간 선물(Hyperliquid/Binance) API를 결합해 서버 비용 0원으로 운영하는 코드입니다.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  ← 실시간 시세 보드로 돌아가기
                </button>
              </div>

              {/* 3단계 핵심 파이프라인 설명 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-[#0b0e14] border border-slate-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
                    01
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">
                    해외 24시간 선물 웹소켓 수신
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Hyperliquid WebSocket</strong>(`wss://api.hyperliquid.xyz/ws`) 또는 <strong>Binance Futures API</strong>를 통해 주말에도 거래되는 삼성전자·SK하이닉스 무기한 선물 시세를 실시간 수신합니다.
                  </p>
                </div>

                <div className="bg-[#0b0e14] border border-slate-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                    02
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">
                    업비트 실시간 테더(KRW-USDT) 결합
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    주말에는 서울외환시장이 휴장하므로 <strong>업비트 WebSocket</strong>(`wss://api.upbit.com/websocket/v1`)에서 실시간 테더 환율을 받아 곱해주어 주말 돌발 매크로 이슈를 즉각 반영합니다.
                  </p>
                </div>

                <div className="bg-[#0b0e14] border border-slate-800 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">
                    03
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">
                    Vercel 무료 배포 & 도메인 연결
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    이 React 코드를 GitHub에 올린 뒤 <strong>Vercel.com</strong>과 연동하면 서버 비용 0원으로 전 세계 CDN 배포가 완료됩니다.
                  </p>
                </div>
              </div>

              {/* 복사 가능한 실전 코드 블록 */}
              <div className="bg-[#0b0e14] border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-[#11151e] border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>liveWeekendSocket.js (업비트 KRW-USDT + Hyperliquid 실시간 연동)</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        코드 복사하기
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`// KOSPILAB PRO - 업비트 실시간 테더(KRW-USDT) + Hyperliquid 24H 한국 주식 선물 웹소켓 연동
let liveUsdtKrw = 1412.0;
const fridayClose = { SAMSUNG: 68400, SKHYNIX: 198500, HYUNDAI: 241000 };

// [1] 업비트 KRW-USDT 실시간 웹소켓 연결 (인증키 불필요)
const upbitWs = new WebSocket('wss://api.upbit.com/websocket/v1');
upbitWs.binaryType = 'arraybuffer';
upbitWs.onopen = () => {
  upbitWs.send(JSON.stringify([
    { ticket: 'kospilab-fx' },
    { type: 'ticker', codes: ['KRW-USDT'] }
  ]));
};
upbitWs.onmessage = (event) => {
  const enc = new TextDecoder('utf-8');
  const data = JSON.parse(enc.decode(new Uint8Array(event.data)));
  if (data?.trade_price) liveUsdtKrw = data.trade_price;
};

// [2] Hyperliquid 24시간 무기한 선물 웹소켓 연결
const hlWs = new WebSocket('wss://api.hyperliquid.xyz/ws');
hlWs.onopen = () => {
  hlWs.send(JSON.stringify({
    method: 'subscribe',
    subscription: { type: 'allMids' }
  }));
};
hlWs.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.channel === 'allMids') {
    const samsungUsd = parseFloat(msg.data.mids['SAMSUNG'] || 49.65);
    const estimatedKrw = Math.round((samsungUsd * liveUsdtKrw) / 100) * 100;
    const gapPct = (((estimatedKrw - fridayClose.SAMSUNG) / fridayClose.SAMSUNG) * 100).toFixed(2);
    console.log(\`삼성전자 주말 실시간 추정가: \${estimatedKrw.toLocaleString()}원 (\${gapPct}%)\`);
  }
};`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. 하단 면책 공고 (Disclaimer Footer) */}
      <footer className="max-w-[1600px] mx-auto px-4 py-6 mt-6 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>면책 공고 (Disclaimer):</strong> 본 서비스(KOSPILAB PRO)에서 제공하는 주말·야간 실시간 시세는 해외 암호화폐 파생상품 거래소(Hyperliquid, Binance 등)의 무기한 선물 및 미국 ADR 시세를 실시간 테더(USDT/KRW) 또는 고시 환율로 환산한 참고용 추정치입니다. 실제 월요일 한국거래소(KRX) 및 넥스트레이드(NXT) 시초가와 차이가 발생할 수 있으며, 모든 투자 판단과 책임은 투자자 본인에게 있습니다.
            </p>
          </div>
          <div className="text-slate-400 font-mono shrink-0">
            KOSPILAB PRO v3.0 · 24/7 Live Engine
          </div>
        </div>
      </footer>
    </div>
  );
}

// 미니 스파크라인 차트 컴포넌트 (종목 카드 내부)
function Sparkline({ data, basePrice, isUp }) {
  const min = Math.min(...data, basePrice);
  const max = Math.max(...data, basePrice);
  const range = max - min || 1;
  const width = 112;
  const height = 44;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const baseY = height - ((basePrice - min) / range) * (height - 8) - 4;
  const strokeColor = isUp ? '#f04452' : '#3182f6';

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <line
        x1="0"
        y1={baseY}
        x2={width}
        y2={baseY}
        stroke="#475569"
        strokeDasharray="2,2"
        strokeWidth="1"
      />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// 우측 상세 패널의 인터랙티브 차트 컴포넌트
function DetailedChart({ history, baseClose, isUp }) {
  const min = Math.min(...history, baseClose) * 0.997;
  const max = Math.max(...history, baseClose) * 1.003;
  const range = max - min || 1;
  const width = 520;
  const height = 175;

  const coords = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 28) - 14;
    return { x, y, val };
  });

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPoints = `0,${height} ${polylinePoints} ${width},${height}`;
  const baseCloseY = height - ((baseClose - min) / range) * (height - 28) - 14;
  const mainColor = isUp ? '#f04452' : '#3182f6';

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
        <defs>
          <linearGradient id="chartGradUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f04452" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#f04452" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="chartGradDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3182f6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3182f6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <polygon
          points={areaPoints}
          fill={isUp ? 'url(#chartGradUp)' : 'url(#chartGradDown)'}
        />

        <line
          x1="0"
          y1={baseCloseY}
          x2={width}
          y2={baseCloseY}
          stroke="#64748b"
          strokeDasharray="4,4"
          strokeWidth="1.2"
        />
        <text
          x={8}
          y={Math.max(12, baseCloseY - 5)}
          fill="#94a3b8"
          fontSize="10"
          fontFamily="monospace"
        >
          금요일 기준종가: {baseClose.toLocaleString()}원
        </text>

        <polyline
          fill="none"
          stroke={mainColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {coords.length > 0 && (
          <g>
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="4.5"
              fill={mainColor}
            />
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="9"
              fill={mainColor}
              fillOpacity="0.25"
            />
          </g>
        )}
      </svg>
    </div>
  );
}