/**
 * prose-coverage.test.ts — guard lop VAN LUAN cach cuc (Task B1).
 *
 * Khuon do cua chart-name-coverage.test.ts, nhung ap cho CHUOI VAN chu khong phai TU:
 * chay detectPatterns(chart) + getMingGongSummary(chart) va tra cuu STAR_DESCRIPTIONS tren
 * matrix la mau cua chart-name-coverage (24 ngay x 2 gioi tinh = 48 la so), CO THEM vong quet
 * bo sung (EXTRA duoi day → tong 300 la so) vi nhieu cach cuc rat hiem, matrix khong cham. Moi
 * chuoi hien thi duoc deu phai tra ra ban dich. Khi fail, guard in DANH SACH GOM THEO NHOM —
 * danh sach do chinh la dau vao cua Task B2 (dien PROSE_VI va terms.override).
 *
 * TAI SAO CHUA them vao chain `test` cua package.json: bang PROSE_VI luc nay MOI CO 3 du an
 * thu (chung minh duong ong noi lien), nen guard nay FAIL THEO THIET KE — them no vao chain
 * se lam nhanh xanh cua branch. Them dong `&& tsx scripts/regression/prose-coverage.test.ts`
 * vao `test` NGAY KHI Task B2 dien het danh sach in ra duoi day (guard phai XANH o lan chay
 * dau tien sau khi B2 xong, khong phai sua guard de no xanh).
 *
 * MIEN TR CO CHU DIC (ly do ghi bang chuoi nguyen van, khong dung pattern mien hoac mau):
 *  - pattern.source : trich dan co sach (《紫微斗数全书·紫府同宫格》) — la DATA/ten tac pham,
 *    giu nguyen van theo phan quyet tu Task c2/c3 (SEO + co thu khong doi khi doi ngon ngu).
 *  - pattern.level  : ENUM TIENG ANH ('excellent'|'good'|'neutral'|'caution'), khong phai
 *    chuoi Hán, UI chi dung no lam khoa class mau — khong co gi de dich.
 *  - pattern.palaces: ten cung (DATA cua engine) — di qua <Bi mode="term"> va da duoc
 *    chart-name-coverage.test.ts bao (PALACE_NAMES_ORDER + moi ten cung cua la so mau).
 *
 * Duong tra cuu PHAI khop dung dieu component lam (khong thi guard xanh ma UI van in Hán):
 *  - ten cach cuc   -> <Bi mode="term">  (hien ca hai phien ban; 杀破狼 -> Sát Phá Lang)
 *  - mo ta / dieu kien / keyword / nature -> biText(...).vi (van thay chuoi Hán, rule R30)
 *
 */
import * as nodeModule from 'node:module';
import { generateChart } from '../../lib/ziwei/algorithm';
import { STAR_DESCRIPTIONS } from '../../lib/ziwei/constants';
import { hasProse, hasPhrase, hasTerm } from '../../lib/i18n/resolve';
import type { ZiweiChart } from '../../lib/ziwei/types';

// patterns.ts mang `server-only` (chi co khi Next build) — khuu dung y nhu
// patterns-sihua-bonus.test.ts:15-33.
type HookResult = { url?: string; format?: string; source?: string; shortCircuit?: boolean };
const { registerHooks } = nodeModule as unknown as {
  registerHooks(hooks: {
    resolve(specifier: string, context: unknown, next: (s: string, c: unknown) => HookResult): HookResult;
    load(url: string, context: unknown, next: (u: string, c: unknown) => HookResult): HookResult;
  }): void;
};
const SERVER_ONLY_STUB = 'data:text/javascript,';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: SERVER_ONLY_STUB, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === SERVER_ONLY_STUB) return { format: 'commonjs', source: '', shortCircuit: true };
    return nextLoad(url, context);
  },
});

// Matrix NGUYEN VAN tu chart-name-coverage.test.ts:67-74 (24 ngay x 2 gioi tinh = 48 la so).
// Sao chep la co tinh: file kia chay toan bo coverage luc import nen khong the import no.
// Neu matrix o do doi, doi o day theo — bao cao Task 10 dem tu kho tren ca hai.
const SAMPLES: Array<[number, number, number, number]> = [
  [1990, 6, 15, 6], [1985, 1, 20, 0], [2000, 2, 29, 11], [1976, 12, 31, 5],
  [1948, 3, 1, 2], [2026, 7, 24, 8], [1994, 8, 9, 10], [1969, 4, 4, 3],
  [2012, 9, 10, 7], [1937, 11, 22, 1], [2023, 5, 6, 4], [1959, 10, 1, 9],
  [1971, 6, 18, 11], [2008, 1, 1, 0], [1988, 7, 7, 6], [1999, 12, 25, 2],
  [2019, 2, 5, 10], [1945, 8, 15, 4], [2030, 6, 1, 8], [1954, 4, 12, 0],
  [1982, 3, 13, 5], [2004, 11, 30, 11], [1966, 9, 9, 3], [2021, 1, 3, 7],
];

/**
 * Hai DUONG tra cuu (phai khop dung dieu component lam — xem header):
 *  - 'term'  : <Bi mode="term"> → bang thuat ngu (terms.override.ts / terms.generated.ts)
 *  - 'prose' : biText(...).vi    → UI_VI truoc, PROSE_VI sau
 * Mot chuoi co the can o ca hai duong (ten cach cuc '紫府同宫' khac duong voi dieu kien
 * '紫微天府同入命宫'), va mot token co the xuat hien o nhieu nhom (keyword cua sao va keyword
 * cua menh cung cung la '桃花'). Vi the: dem theo duong+chuoi (so THAT B2 can viet), in theo
 * nhom (boi canh dich). Tong cac nhom vi the CO the lon hon so chuoi khac biet — do la ly do
 * dong dau in ca hai con so.
 */
type Route = 'term' | 'prose';
const uniqueMiss = new Map<string, { zh: string; route: Route }>();
const groupLines = new Map<string, Map<string, Set<string>>>();
const seen = new Set<string>();
const add = (zh: string, group: string, from: string, route: Route, ok: (s: string) => boolean) => {
  if (!zh) return;
  const key = route + '|' + zh;
  if (ok(zh)) { seen.add(key); return; }
  if (!uniqueMiss.has(key)) uniqueMiss.set(key, { zh, route });
  let lines = groupLines.get(group);
  if (!lines) { lines = new Map<string, Set<string>>(); groupLines.set(group, lines); }
  let froms = lines.get(zh);
  if (!froms) { froms = new Set<string>(); lines.set(zh, froms); }
  froms.add(from);
};

const proseOk = (zh: string) => hasProse(zh) || hasPhrase(zh);
const termOk = (zh: string) => hasTerm(zh);

/**
 * MA TRAN: 48 la so mau (bat buoc — dung matrix cua chart-name-coverage) + 252 la so QUEP BO
 * SUNG. Ly do co vong bo sung: nhieu cach cuc rat hiem, matrix mau khong bat duoc — do la
 * phan "an" cua danh sach B2. Vi du do duoc: duong '紫府同宫' 同入命宫 (seed cua B1) chi xuat
 * hien o 1951-5-10 gio Mao (hour index 3), khong co trong matrix. Vong bo sung o day (21 nam
 * cach 4 nam x 6 moc thang x 2 gioi tinh, cung gio Mao) lam cho danh sach THAT su phan anh
 * bang cach cuc, khong phai chi phan deu cua matrix.
 */
const EXTRA: Array<[number, number, number, number]> = [];
for (let y = 1950; y <= 2030; y += 4) for (const m of [1, 3, 5, 7, 9, 11]) EXTRA.push([y, m, 10, 3]);

async function main() {
  const { detectPatterns, getMingGongSummary } = await import('../../lib/ziwei/patterns');

  let patternHits = 0;
  let charts = 0;
  const patternNames = new Set<string>();

  for (const [y, m, d, h] of [...SAMPLES, ...EXTRA]) {
    for (const g of ['male', 'female'] as const) {
      charts++;
      const chart: ZiweiChart = generateChart({ year: y, month: m, day: d, hour: h, gender: g });

      // 1. Cach cuc: ten = thuat ngu, mo ta + dieu kien = van.
      for (const p of detectPatterns(chart)) {
        patternHits++;
        patternNames.add(p.name);
        const who = p.name;
        add(p.name, 'Ten cach cuc (Bi mode="term")', who, 'term', termOk);
        add(p.description, 'Mo ta cach cuc (biText().vi)', who, 'prose', proseOk);
        // source/level: MIEN TR co chu dich — xem header.
        for (const c of p.conditions?.required ?? []) add(c, 'Dieu kien · phai (biText().vi)', who, 'prose', proseOk);
        for (const c of p.conditions?.bonus ?? []) add(c, 'Dieu kien · cong (biText().vi)', who, 'prose', proseOk);
        for (const c of p.conditions?.breaking ?? []) add(c, 'Dieu kien · pha (biText().vi)', who, 'prose', proseOk);
        // p.palaces: ten cung, da co chart-name-coverage + Bi term — xem header (mien tr).
      }

      // 2. Tom luoc Menh cung: keyword/nature cua patterns.ts (ChartSummary render no).
      const s = getMingGongSummary(chart);
      for (const k of s.keywords) add(k, 'Keyword menh cung (biText().vi)', 'getMingGongSummary', 'prose', proseOk);
      add(s.nature, 'Nature menh cung (biText().vi)', 'getMingGongSummary', 'prose', proseOk);

      // 3. STAR_DESCRIPTIONS: dung cac key ma la so nay thực sự chạm toi (StarDetailPanel).
      for (const palace of chart.palaces) {
        for (const star of palace.stars) {
          const desc = STAR_DESCRIPTIONS[star.name];
          if (!desc) continue;
          const from = `STAR_DESCRIPTIONS['${star.name}']`;
          for (const k of desc.keywords.split('·')) add(k.trim(), 'Keyword sao (biText().vi)', from, 'prose', proseOk);
          add(desc.nature, 'Nature sao (biText().vi)', from, 'prose', proseOk);
        }
      }
    }
  }

  // 4. Toan bo 14 khoa STAR_DESCRIPTIONS: du matrix khong cham het 14 chinh tinh thi B2 van
  //    can dich ca bang (panel mo cho MOI sao nguoi dung bam vao).
  for (const [star, desc] of Object.entries(STAR_DESCRIPTIONS)) {
    const from = `STAR_DESCRIPTIONS['${star}']`;
    for (const k of desc.keywords.split('·')) add(k.trim(), 'Keyword sao (biText().vi)', from, 'prose', proseOk);
    add(desc.nature, 'Nature sao (biText().vi)', from, 'prose', proseOk);
  }

  // SAN FLOOR — neu detectPatterns doi shape (tra ve mang rong, conditions mat chuoi) thi vong
  // quét chay tren khong-thong va guard "xanh" ma khong phan nao. So lieu do lan dau (B1):
  // 300 la so → 1286 luot khop, 61 ten cach cuc phan biet. San duoi (800 / 40) cho phep mot so
  // lam tron duong nhan (gio bo sung, ngay le…) nhung khong cho phep mat mot nua bo cach cuc.
  if (patternNames.size < 40 || patternHits < 800) {
    console.error(`✗ Shape regression: ${patternHits} luot khop cach cuc / ${patternNames.size} ten khac biet tren ` +
      `${charts} la so (san: 800 luot / 40 ten) — guard dang chay tren du lieu rong, khong duoc tinh la đạt.`);
    process.exit(1);
  }

  if (uniqueMiss.size) {
    // So luot in theo nhom (>= so chuoi khac biet): mot token co the xuat o nhieu nhom.
    let printed = 0;
    for (const lines of groupLines.values()) printed += lines.size;
    const proseCount = [...uniqueMiss.values()].filter((e) => e.route === 'prose').length;
    console.error(`✗ prose-coverage: ${uniqueMiss.size} chuoi hien thi CHUA co ban dich ` +
      `(${proseCount} qua PROSE_VI/UI_VI + ${uniqueMiss.size - proseCount} ten cach cuc qua bang thuat ngu)` +
      ` — tu ${charts} la so, ${patternHits} luot cach cuc, ${patternNames.size} ten; ` +
      `${printed} dong in theo nhom (mot token o hai nhom chi tinh mot lan trong con so dau).`);
    for (const group of [...groupLines.keys()].sort()) {
      const lines = groupLines.get(group)!;
      console.error(`\n  [${group}] ${lines.size} chuoi:`);
      console.error([...lines.keys()].sort().map((zh) => {
        const from = [...lines.get(zh)!].slice(0, 3).join(' | ');
        return `    ${zh}\n        ← ${from}${lines.get(zh)!.size > 3 ? ' …' : ''}`;
      }).join('\n'));
      // Nhac noi dung bang phai dien theo DUNG duong render (xem header) — noi B2 lam nhanh:
      console.error(group.startsWith('Ten cach cuc')
        ? '      → THEM BANG THUAT NGU: lib/i18n/terms.override.ts (kind: \'pattern\', note bat buoc).\n' +
          '        LUU Y cho B2: vai ten cach cuc la chuoi GHEP luc chay (vi du \'太阳化禄入命\',\n' +
          '        \'天机化忌入迁\' — patterns.ts:684/705), khong phai literal tinh. Chon mot trong hai:\n' +
          '        khai bao tung to hop ma guard nay liet ke, hoac ghep tu thanh phan nhu viPillar()\n' +
          '        da lam voi tru can chi (resolve.ts:51). KHONG day ten cach cuc vao PROSE_VI —\n' +
          '        <Bi mode="term"> chi nhin bang thuat ngu.'
        : '      → THEM VAN: lib/i18n/prose-patterns.ts (PROSE_VI, key = dung chuoi tren)');
    }
    console.error(`\n→ dien tung chuoi tren (nguyen van lam key) vao lib/i18n/prose-patterns.ts (Task B2),`);
    console.error(`  chay lai guard nay cho den khi XANH, roi mới noi vao chain \`test\` cua package.json.`);
    console.error(`  Da khop ${seen.size} luot tra cuu (tinh theo nhom+chuoi) — 3 du an thu cua B1 nam trong so do.`);
    process.exit(1);
  }

  console.log(`✅ prose-coverage: ${patternHits} luot khop / ${patternNames.size} cach cuc + STAR_DESCRIPTIONS, ` +
    `moi chuoi hien thi deu co ban dich (${seen.size} chuoi tra duoc).`);
}

main();
