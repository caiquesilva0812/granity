import {
  Block,
  BlockObservationPhoto,
  BlockPhoto,
  BlockStatus,
  Currency,
  MaterialClassification,
  MaterialType,
  PhotoAngle,
} from '@prisma/client';

type BlockWithRelations = Block & {
  materialType:      MaterialType | null;
  classification:    MaterialClassification | null;
  photos:            BlockPhoto[];
  observationPhotos: BlockObservationPhoto[];
};

class AnglePhotoDto {
  angle: PhotoAngle;
  url:   string;
  constructor(p: BlockPhoto) { this.angle = p.angle; this.url = p.url; }
}

class ObservationPhotoDto {
  id:      string;
  url:     string;
  caption: string | null;
  constructor(p: BlockObservationPhoto) { this.id = p.id; this.url = p.url; this.caption = p.caption; }
}

export class BlockResponseDto {
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
  classificationCurrency:     Currency | null;
  status:                     BlockStatus;
  extractionFront:            string | null;
  extractedAt:                Date | null;
  notes:                      string | null;
  photos:                     AnglePhotoDto[];
  observationPhotos:          ObservationPhotoDto[];
  createdAt:                  Date;

  constructor(block: BlockWithRelations) {
    const c    = Number(block.c);
    const l    = Number(block.l);
    const a    = Number(block.a);
    const cNet = Number(block.cNet);
    const lNet = Number(block.lNet);
    const aNet = Number(block.aNet);

    this.id                         = block.id;
    this.code                       = block.code;
    this.c                          = c;
    this.l                          = l;
    this.a                          = a;
    this.cNet                       = cNet;
    this.lNet                       = lNet;
    this.aNet                       = aNet;
    this.volumeGross                = c * l * a;
    this.volumeNet                  = cNet * lNet * aNet;
    this.materialTypeId             = block.materialTypeId;
    this.materialTypeName           = block.materialType?.name ?? null;
    this.materialClassificationId   = block.materialClassificationId;
    this.materialClassificationName = block.classification?.name ?? null;
    this.classificationPrice        = block.classification ? Number(block.classification.price) : null;
    this.classificationCurrency     = block.classification?.currency ?? null;
    this.status                     = block.status;
    this.extractionFront            = block.extractionFront;
    this.extractedAt                = block.extractedAt;
    this.notes                      = block.notes;
    this.photos                     = block.photos.map((p) => new AnglePhotoDto(p));
    this.observationPhotos          = block.observationPhotos.map((p) => new ObservationPhotoDto(p));
    this.createdAt                  = block.createdAt;
  }
}
