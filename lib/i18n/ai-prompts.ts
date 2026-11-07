/**
 * ĐẦU VÀO MÁY (prompt gửi /api/interpret) — SONG NGỮ Trung／Việt.
 *
 * Đây là FILE DUY NHẤT cần sửa khi muốn đổi lời prompt. Component chỉ gọi builder,
 * không giữ chữ Hán nào, nên ratchet ui-phrase-coverage không phải miễn trừ prompt nữa.
 *
 * Vì sao giữ vế Hán: khóa dữ liệu của engine là chữ Hán (tên cung, tên sao, bốn hóa),
 * và ngữ liệu Ni Hải Hạ／cổ thư mà mô hình dựa vào cũng là chữ Hán. Bỏ vế Hán thì mô hình
 * mất mỏ neo thuật ngữ; bỏ vế Việt thì người đọc không hiểu mình đã gửi gì. Nên mỗi
 * dòng chỉ dẫn đi thành CẶP: dòng Hán trước, dòng Việt ngay sau, cùng một nghĩa.
 *
 * Quy ước bất biến (ai-prompt-bilingual.test.ts giữ):
 *   - `zh` phải chứa chữ Hán, `vi` phải KHÔNG chứa chữ Hán (đối chiếu thuần, không trộn);
 *   - mọi mục render ra đúng thứ tự zh rồi vi, tiêu đề dạng **【Hán】/【Việt】**
 *     để AiContent (InsightPanel.tsx:155) vẫn nhận diện được;
 *   - tên cung／sao／hóa lấy từ bảng thuật ngữ (biTerm), không dịch tay ở đây —
 *     sửa thuật ngữ thì sửa terms.override.ts, prompt tự đổi theo.
 *
 * Pure, không mutable state cấp module: an toàn khi gọi lúc render.
 */
import { biTerm, biText, viTerm } from './resolve';

export interface BiLine {
  zh: string;
  vi: string;
}

export interface PromptSection {
  title: BiLine;
  body: BiLine;
}

export interface PromptSpec {
  lead: BiLine;
  sections: PromptSection[];
}

export type TopicKey = 'overview' | 'love' | 'career' | 'wealth' | 'health' | 'personality';

/**
 * Quy ước đặt trước mỗi prompt. Mô hình thấy hai ngôn ngữ thì phải được nói rõ trả lời
 * bằng tiếng nào, nếu không nó chọn tùy hứng — đây là một phần của đầu vào, không phải
 * tính năng thêm.
 */
export const PROMPT_NOTE: BiLine = {
  zh: '以下指令以中文／越南文对照给出，两版同义。命盘数据（宫位、星曜、四化）沿用中文键，因为排盘引擎内部以中文为键空间。请用越南语撰写解读，小标题保留【中文】/【越南文】对照格式，术语首次出现时附中文原文。',
  vi: 'Chỉ dẫn dưới đây được đối chiếu tiếng Trung／tiếng Việt, hai bản cùng nghĩa. Dữ liệu lá số (cung, sao, Tứ Hóa) giữ khóa tiếng Trung vì engine lập lá số lấy chữ Hán làm không gian khóa nội bộ. Hãy viết luận giải bằng tiếng Việt, giữ tiêu đề ở dạng đối chiếu 【bản Trung】/【bản Việt】, và kèm nguyên văn tiếng Trung khi thuật ngữ xuất hiện lần đầu.',
};

export const TOPIC_PROMPTS: Record<TopicKey, PromptSpec> = {
  overview: {
    lead: {
      zh: '请生成命格总览，按以下结构输出：',
      vi: 'Hãy tạo bản tổng quan mệnh cách, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '命格定性', vi: 'Định tính mệnh cách' },
        body: {
          zh: '用一句话概括这个命盘的核心格局与命主气质。',
          vi: 'Tóm tắt trong một câu cách cục cốt lõi của lá số này và khí chất của mệnh chủ.',
        },
      },
      {
        title: { zh: '主星解读', vi: 'Luận giải chính tinh' },
        body: {
          zh: '命宫主星的核心特质，引用倪海厦原话或观点。',
          vi: 'Đặc tính cốt lõi của chính tinh cung Mệnh, trích dẫn nguyên văn hoặc quan điểm của thầy Ni Hải Hạ.',
        },
      },
      {
        title: { zh: '三方四正', vi: 'Tam phương tứ chính' },
        body: {
          zh: '财、官、迁三宫的联动分析及整体格局。',
          vi: 'Phân tích liên động ba cung Tài Bạch, Quan Lộc, Thiên Di và cách cục tổng thể.',
        },
      },
      {
        title: { zh: '当前大限', vi: 'Đại hạn hiện tại' },
        body: {
          zh: '当下大限运势方向与最值得关注的事项。',
          vi: 'Phương hướng vận trình của đại hạn hiện tại và những việc đáng lưu tâm nhất.',
        },
      },
      {
        title: { zh: '优势与注意', vi: 'Ưu thế và điều cần lưu ý' },
        body: {
          zh: '命盘天赋优势，以及需要注意的风险或功课。',
          vi: 'Ưu thế thiên phú của lá số, cùng những rủi ro hoặc bài học cần lưu ý.',
        },
      },
    ],
  },

  love: {
    lead: {
      zh: '请深度分析感情婚姻运，按以下结构输出：',
      vi: 'Hãy phân tích chiều sâu vận tình cảm hôn nhân, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '感情格局', vi: 'Cách cục tình cảm' },
        body: {
          zh: '一句话定性感情命格。',
          vi: 'Định tính mệnh cách tình cảm trong một câu.',
        },
      },
      {
        title: { zh: '夫妻宫分析', vi: 'Phân tích cung Phu Thê' },
        body: {
          zh: '夫妻宫主星、四化，以及倪海厦体系的具体解读。',
          vi: 'Chính tinh và Tứ hóa của cung Phu Thê, cùng luận giải cụ thể theo hệ Ni Hải Hạ.',
        },
      },
      {
        title: { zh: '三方联动', vi: 'Liên động tam phương' },
        body: {
          zh: '相关宫位对感情的影响。',
          vi: 'Ảnh hưởng của các cung liên quan đến tình cảm.',
        },
      },
      {
        title: { zh: '当前大限感情运', vi: 'Vận tình cảm trong đại hạn hiện tại' },
        body: {
          zh: '当下10年感情走向与关键节点。',
          vi: 'Chiều hướng tình cảm 10 năm hiện tại và các mốc then chốt.',
        },
      },
      {
        title: { zh: '实际建议', vi: 'Kiến nghị thực tế' },
        body: {
          zh: '具体可行的感情建议。',
          vi: 'Kiến nghị tình cảm cụ thể, khả thi.',
        },
      },
    ],
  },

  career: {
    lead: {
      zh: '请深度分析事业运，按以下结构输出：',
      vi: 'Hãy phân tích chiều sâu vận sự nghiệp, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '事业格局', vi: 'Cách cục sự nghiệp' },
        body: {
          zh: '一句话定性事业命格，宜任职或宜创业。',
          vi: 'Định tính mệnh cách sự nghiệp trong một câu: nên làm công hay nên khởi nghiệp.',
        },
      },
      {
        title: { zh: '官禄宫分析', vi: 'Phân tích cung Quan Lộc' },
        body: {
          zh: '官禄宫主星、四化，以及倪师对这种配置的判断。',
          vi: 'Chính tinh và Tứ hóa của cung Quan Lộc, cùng phán đoán của thầy Ni Hải Hạ về cấu hình này.',
        },
      },
      {
        title: { zh: '财帛宫联动', vi: 'Liên động cung Tài Bạch' },
        body: {
          zh: '财运与事业的关系，财路来源分析。',
          vi: 'Quan hệ giữa tài vận và sự nghiệp, phân tích nguồn tài lộ.',
        },
      },
      {
        title: { zh: '当前大限事业运', vi: 'Vận sự nghiệp trong đại hạn hiện tại' },
        body: {
          zh: '当下10年事业走向。',
          vi: 'Chiều hướng sự nghiệp 10 năm hiện tại.',
        },
      },
      {
        title: { zh: '实际建议', vi: 'Kiến nghị thực tế' },
        body: {
          zh: '适合的方向、行业与策略。',
          vi: 'Phương hướng, ngành nghề và chiến lược phù hợp.',
        },
      },
    ],
  },

  wealth: {
    lead: {
      zh: '请深度分析财运，按以下结构输出：',
      vi: 'Hãy phân tích chiều sâu tài vận, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '财运格局', vi: 'Cách cục tài vận' },
        body: {
          zh: '一句话定性财运模式，是主动财还是被动财。',
          vi: 'Định tính mô hình tài vận trong một câu: tài chủ động hay tài thụ động.',
        },
      },
      {
        title: { zh: '财帛宫分析', vi: 'Phân tích cung Tài Bạch' },
        body: {
          zh: '财帛宫主星、四化，财富来源与流动模式。',
          vi: 'Chính tinh và Tứ hóa của cung Tài Bạch, nguồn của cải và mô hình luân chuyển.',
        },
      },
      {
        title: { zh: '田宅宫（财库）', vi: 'Cung Điền Trạch (kho tài)' },
        body: {
          zh: '积蓄能力与不动产运势分析。',
          vi: 'Phân tích năng lực tích lũy và vận bất động sản.',
        },
      },
      {
        title: { zh: '当前大限财运', vi: 'Tài vận trong đại hạn hiện tại' },
        body: {
          zh: '当下财运走向与注意事项。',
          vi: 'Chiều hướng tài vận hiện tại và những điều cần lưu ý.',
        },
      },
      {
        title: { zh: '理财建议', vi: 'Kiến nghị quản lý tài chính' },
        body: {
          zh: '具体的财务建议。',
          vi: 'Kiến nghị tài chính cụ thể.',
        },
      },
    ],
  },

  health: {
    lead: {
      zh: '请分析健康运势，按以下结构输出：',
      vi: 'Hãy phân tích vận trình sức khỏe, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '疾厄宫主星', vi: 'Chính tinh cung Tật Ách' },
        body: {
          zh: '疾厄宫星曜与健康含义。',
          vi: 'Tinh diệu cung Tật Ách và hàm nghĩa sức khỏe.',
        },
      },
      {
        title: { zh: '主要风险', vi: 'Rủi ro chính' },
        body: {
          zh: '结合倪海厦子午流注理论，分析主要健康隐患与需关注的部位。',
          vi: 'Kết hợp lý thuyết Tử Ngọ Lưu Chú của thầy Ni Hải Hạ, phân tích những nguy cơ sức khỏe chính và các bộ phận cần lưu ý.',
        },
      },
      {
        title: { zh: '大限健康走势', vi: 'Diễn biến sức khỏe trong đại hạn' },
        body: {
          zh: '当下健康趋势与关键时间段。',
          vi: 'Xu thế sức khỏe hiện tại và các khoảng thời gian then chốt.',
        },
      },
      {
        title: { zh: '预防建议', vi: 'Kiến nghị phòng ngừa' },
        body: {
          zh: '具体注意事项与养生方向。',
          vi: 'Những điều cần lưu ý cụ thể và phương hướng dưỡng sinh.',
        },
      },
    ],
  },

  personality: {
    lead: {
      zh: '请深度解析性格特质，按以下结构输出：',
      vi: 'Hãy phân tích chiều sâu đặc điểm tính cách, xuất theo cấu trúc sau:',
    },
    sections: [
      {
        title: { zh: '命宫主星性格', vi: 'Tính cách chính tinh cung Mệnh' },
        body: {
          zh: '命宫主星的核心性格特质，引用倪师原话。',
          vi: 'Đặc điểm tính cách cốt lõi của chính tinh cung Mệnh, trích nguyên văn thầy Ni Hải Hạ.',
        },
      },
      {
        title: { zh: '三方性格综合', vi: 'Tổng hợp tính cách tam phương' },
        body: {
          zh: '财、官、迁三宫对性格的影响，全貌描绘。',
          vi: 'Ảnh hưởng của ba cung Tài Bạch, Quan Lộc, Thiên Di đến tính cách, phác họa toàn cảnh.',
        },
      },
      {
        title: { zh: '人际关系模式', vi: 'Mô hình quan hệ với người khác' },
        body: {
          zh: '与他人互动方式、待人处世风格。',
          vi: 'Cách tương tác với người khác, phong cách đối nhân xử thế.',
        },
      },
      {
        title: { zh: '优势与人生课题', vi: 'Ưu thế và bài học đường đời' },
        body: {
          zh: '天赋优势，以及需要面对的人生功课。',
          vi: 'Ưu thế thiên phú, cùng những bài học đường đời cần đối mặt.',
        },
      },
    ],
  },
};

/**
 * Khóa là `palace.name` LÚC CHẠY của engine, KHÔNG phải PALACE_NAMES_ORDER của constants.ts.
 * iztro chỉ giữ chữ 宫 cho 命宫, các cung khác mất hậu tố, và cung bạn bè là 仆役 chứ
 * không phải 交友 (xem lib/ziwei/db-analysis.ts:17-32, TOPIC_PALACE_NAME).
 * Bảng cũ của InsightPanel khóa theo '夫妻宫'… nên không bao giờ khớp và `主管：` luôn
 * rỗng — prompt đầu tiên bấm vào một cung trên /chart đã crash vì role undefined.
 * ai-prompt-bilingual.test.ts phủ cả 12 cung của một lá số thật để lỗi này không quay lại.
 */
export const PALACE_ROLES: Record<string, BiLine> = {
  '命宫': { zh: '自我、性格、先天格局', vi: 'Bản thân, tính cách, cách cục tiên thiên' },
  '兄弟': { zh: '兄弟关系、合伙人', vi: 'Quan hệ anh em, người hợp tác' },
  '夫妻': { zh: '感情关系、婚姻状态', vi: 'Quan hệ tình cảm, trạng thái hôn nhân' },
  '子女': { zh: '子女缘分、下属关系', vi: 'Duyên con cái, quan hệ cấp dưới' },
  '财帛': { zh: '财运来源、收入方式', vi: 'Nguồn tài vận, phương thức thu nhập' },
  '疾厄': { zh: '身体健康、意外', vi: 'Sức khỏe thân thể, tai nạn bất ngờ' },
  '迁移': { zh: '外出机遇、人际格局', vi: 'Cơ hội khi ra ngoài, cách cục quan hệ' },
  '仆役': { zh: '朋友圈、贵人、小人', vi: 'Vòng bạn bè, quý nhân, tiểu nhân' },
  '官禄': { zh: '事业成就、社会地位', vi: 'Thành tựu sự nghiệp, địa vị xã hội' },
  '田宅': { zh: '不动产、家庭环境', vi: 'Bất động sản, hoàn cảnh gia đình' },
  '福德': { zh: '精神享受、内心福分', vi: 'Hưởng thụ tinh thần, phúc phần nội tâm' },
  '父母': { zh: '父母关系、文书契约', vi: 'Quan hệ cha mẹ, văn thư khế ước' },
};

const EMPTY_PALACE: BiLine = { zh: '空宫（借对宫）', vi: 'Cung trống (mượn cung đối diện)' };
const UNKNOWN_PALACE: BiLine = { zh: '未知宫位', vi: 'Cung không xác định' };

/** Tiêu đề mục: **【Hán】/【Việt】** — AiContent khớp `^\*\*【(.+?)】\*\*$` nên vẫn render được. */
function sectionTitle(t: BiLine): string {
  return `**【${t.zh}】/【${t.vi}】**`;
}

function renderPrompt(spec: PromptSpec): string {
  const lines: string[] = [PROMPT_NOTE.zh, PROMPT_NOTE.vi, '', spec.lead.zh, spec.lead.vi];
  for (const s of spec.sections) {
    lines.push('', sectionTitle(s.title), s.body.zh, s.body.vi);
  }
  return lines.join('\n');
}

export function buildTopicPrompt(key: TopicKey): string {
  return renderPrompt(TOPIC_PROMPTS[key]);
}

/** Sao chính tinh của một cung: vế Hán giữ nguyên chuỗi engine, vế Việt tra bảng thuật ngữ. */
function starList(stars: { name: string; siHua?: string }[]): BiLine {
  const zh: string[] = [];
  const vi: string[] = [];
  for (const s of stars) {
    const huaZh = s.siHua ? `化${s.siHua}` : '';
    zh.push(`${s.name}${huaZh}`);
    const nameVi = viTerm(s.name, 'star') ?? s.name;
    const huaVi = huaZh ? (viTerm(huaZh, 'mutagen') ?? huaZh) : '';
    vi.push(huaVi ? `${nameVi} ${huaVi}` : nameVi);
  }
  return zh.length ? { zh: zh.join('、'), vi: vi.join(', ') } : EMPTY_PALACE;
}

export function buildPalacePrompt(palaceName: string, stars: { name: string; siHua?: string }[]): string {
  const p = biTerm(palaceName, 'palace');
  const role = PALACE_ROLES[palaceName];
  const list = starList(stars);
  return renderPrompt({
    lead: {
      zh: `请重点分析【${p.zh}】（主管：${role.zh}），该宫主星为${list.zh}，按以下结构输出：`,
      vi: `Hãy phân tích trọng điểm 【cung ${p.vi}】(chủ quản: ${role.vi}), chính tinh của cung là ${list.vi}; xuất theo cấu trúc sau:`,
    },
    sections: [
      {
        title: { zh: '宫位定性', vi: 'Định tính cung vị' },
        body: {
          zh: `${p.zh}在命盘中的意义，以及这种星曜配置的整体判断。`,
          vi: `Ý nghĩa của cung ${p.vi} trong lá số, cùng phán đoán tổng thể về cấu hình tinh diệu này.`,
        },
      },
      {
        title: { zh: '主星解读', vi: 'Luận giải chính tinh' },
        body: {
          zh: '主星在此宫的倪海厦体系解读，引用具体观点。',
          vi: 'Luận giải chính tinh tại cung này theo hệ Ni Hải Hạ, trích dẫn quan điểm cụ thể.',
        },
      },
      {
        title: { zh: '三方四正联动', vi: 'Liên động tam phương tứ chính' },
        body: {
          zh: '三方四正宫位对此宫的影响。',
          vi: 'Ảnh hưởng của các cung tam phương tứ chính đến cung này.',
        },
      },
      {
        title: { zh: '实际建议', vi: 'Kiến nghị thực tế' },
        body: {
          zh: '基于此宫的具体建议。',
          vi: 'Kiến nghị cụ thể dựa trên cung này.',
        },
      },
    ],
  });
}

export interface SiHuaPromptInput {
  starName: string;
  siHua: string;
  /** 'daxian' → 大限; mọi giá trị khác → 流年 (giữ đúng hành vi cũ của InsightPanel). */
  viewLabel: 'daxian' | 'other';
  /** Tên cung Hán của engine; không tìm thấy cung chứa sao thì để trống. */
  palaceName?: string;
}

export function buildSiHuaPrompt(input: SiHuaPromptInput): string {
  const view = input.viewLabel === 'daxian' ? biText('大限') : biText('流年');
  const star = biTerm(input.starName, 'star');
  const huaZh = `化${input.siHua}`;
  const hua = biTerm(huaZh, 'mutagen');
  const palaceZh = input.palaceName ?? UNKNOWN_PALACE.zh;
  const palaceViName = input.palaceName ? viTerm(input.palaceName, 'palace') : undefined;
  const palaceVi = palaceViName ? `cung ${palaceViName}` : UNKNOWN_PALACE.vi;

  return renderPrompt({
    lead: {
      zh: `请分析【${view.zh}${star.zh}${hua.zh}】的飞化影响，按以下结构输出：`,
      vi: `Hãy phân tích ảnh hưởng phi hóa của 【${view.vi} ${star.vi} ${hua.vi}】, xuất theo cấu trúc sau:`,
    },
    sections: [
      {
        title: { zh: `${hua.zh}基本含义`, vi: `Hàm nghĩa cơ bản của ${hua.vi}` },
        body: {
          zh: `${hua.zh}在倪海厦体系中的核心含义，以及${star.zh}${hua.zh}的特殊含义。`,
          vi: `Hàm nghĩa cốt lõi của ${hua.vi} trong hệ Ni Hải Hạ, cùng hàm nghĩa đặc thù của ${star.vi} ${hua.vi}.`,
        },
      },
      {
        title: { zh: '落宫影响', vi: 'Ảnh hưởng nhập cung' },
        body: {
          zh: `${star.zh}${hua.zh}落在【${palaceZh}】，该宫主管的领域受到何种影响，倪师如何解读。`,
          vi: `${star.vi} ${hua.vi} nhập 【${palaceVi}】; lĩnh vực do cung này chủ quản chịu ảnh hưởng thế nào, thầy Ni Hải Hạ luận giải ra sao.`,
        },
      },
      {
        title: { zh: '三方四正飞化路径', vi: 'Đường phi hóa tam phương tứ chính' },
        body: {
          zh: `${hua.zh}入${palaceZh}后，对其三方四正（对宫、两个三合宫）的联动影响。`,
          vi: `Sau khi ${hua.vi} nhập ${palaceVi}, ảnh hưởng liên động đến tam phương tứ chính của nó (cung đối diện và hai cung tam hợp).`,
        },
      },
      {
        title: { zh: '当前运势影响', vi: 'Ảnh hưởng vận trình hiện tại' },
        body: {
          zh: `在${view.zh}时间维度下，此${hua.zh}对命主近期运势的具体影响。`,
          vi: `Trong chiều thời gian ${view.vi}, ảnh hưởng cụ thể của ${hua.vi} này đến vận trình gần đây của mệnh chủ.`,
        },
      },
      {
        title: { zh: '实际建议', vi: 'Kiến nghị thực tế' },
        body: {
          zh: '基于此四化的具体可操作建议。',
          vi: 'Kiến nghị cụ thể, có thể thực hành, dựa trên Tứ hóa này.',
        },
      },
    ],
  });
}