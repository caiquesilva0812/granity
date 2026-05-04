import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import api from "../helpers/api";
import { extractErrorMessage } from "../helpers/apiError";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface BlockAnglePhoto {
  angle: string;
  url:   string;
}

export interface BlockObservationPhoto {
  id:      string;
  url:     string;
  caption: string | null;
}

export interface Block {
  id:                         string;
  code:                       string;
  c:                          number;
  l:                          number;
  a:                          number;
  cNet:                       number;
  lNet:                       number;
  aNet:                       number;
  volumeGross:                number;
  volumeNet:                  number;
  materialTypeId:             string | null;
  materialTypeName:           string | null;
  materialClassificationId:   string | null;
  materialClassificationName: string | null;
  classificationPrice:        number | null;
  classificationCurrency:     string | null;
  status:                     string;
  extractionFront:            string | null;
  extractedAt:                string | null;
  notes:                      string | null;
  photos:                     BlockAnglePhoto[];
  observationPhotos:          BlockObservationPhoto[];
  createdAt:                  string;
}

export interface CreateBlockPayload {
  code:                      string;
  c:                         number;
  l:                         number;
  a:                         number;
  cNet?:                     number;
  lNet?:                     number;
  aNet?:                     number;
  materialTypeId?:           string;
  materialClassificationId?: string;
  extractionFront?:          string;
  extractedAt?:              string;
  notes?:                    string;
}

function normalizeBlock(raw: Block): Block {
  return {
    ...raw,
    photos:            raw.photos.map((p) => ({ ...p, url: API_BASE + p.url })),
    observationPhotos: raw.observationPhotos.map((p) => ({ ...p, url: API_BASE + p.url })),
  };
}

function replaceInState(blocks: Block[], updated: Block): Block[] {
  const idx = blocks.findIndex((b) => b.id === updated.id);
  if (idx === -1) return blocks;
  const next = [...blocks];
  next[idx] = updated;
  return next;
}

export const useBlocksStore = defineStore("blocks", {
  state: () => ({
    blocks: [] as Block[],
  }),

  actions: {
    async fetchBlocks(companyId: string): Promise<void> {
      const toast = useToast();
      try {
        const res   = await api.get<Block[]>(`/api/v1/companies/${companyId}/blocks`);
        this.blocks = res.data.map(normalizeBlock);
      } catch (error) {
        toast.error(extractErrorMessage(error, "Erro ao carregar blocos."));
      }
    },

    async createBlock(companyId: string, payload: CreateBlockPayload): Promise<Block | null> {
      const toast = useToast();
      try {
        const res   = await api.post<Block>(`/api/v1/companies/${companyId}/blocks`, payload);
        const block = normalizeBlock(res.data);
        this.blocks.unshift(block);
        return block;
      } catch (error) {
        toast.error(extractErrorMessage(error, "Erro ao registrar bloco."));
        return null;
      }
    },

    // Content-Type must be undefined so axios detects FormData and sets
    // multipart/form-data with the correct boundary automatically.
    // The api instance default (application/json) would break multipart uploads.
    async uploadAnglePhoto(
      companyId: string,
      blockId:   string,
      angle:     string,
      file:      File,
    ): Promise<void> {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<Block>(
        `/api/v1/companies/${companyId}/blocks/${blockId}/photos?angle=${angle}`,
        fd,
        { headers: { "Content-Type": undefined } },
      );
      this.blocks = replaceInState(this.blocks, normalizeBlock(res.data));
    },

    async uploadObservationPhoto(
      companyId: string,
      blockId:   string,
      file:      File,
    ): Promise<void> {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<Block>(
        `/api/v1/companies/${companyId}/blocks/${blockId}/observation-photos`,
        fd,
        { headers: { "Content-Type": undefined } },
      );
      this.blocks = replaceInState(this.blocks, normalizeBlock(res.data));
    },
  },
});
