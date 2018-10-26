import { Meta, ModelStatus } from '../models/baseModel.model';

interface Conf {
  value: Meta;
  enumerable: boolean;
}

const DefaultMeta: Meta = {
  status: ModelStatus.READY,
  error: null,
};

const DefaultConf: Conf = {
  value: DefaultMeta,
  enumerable: false,
};

const META_KEY = '_meta';

/**
 * BaseService implements two methods to assign to BaseModels
 * their `meta` property.
 */
export class BaseService {
  /**
   * We defined `_meta` property as `enumerable = false`
   * so when the model is copied or serialized
   * `_meta` property is not omitted
   */
  public setMeta<T>(obj: T, meta: Meta = DefaultMeta, conf?: Conf): T {
    if (!conf) {
      conf = {...DefaultConf, value: meta};
    }
    return Object.defineProperty(obj, META_KEY, conf);
  }

  public setMetaToArray<T>(array: T[], meta: Meta = DefaultMeta): T[] {
    const conf: Conf = {...DefaultConf, value: meta};
    return array.map(
      (obj) => this.setMeta<T>(obj, meta, conf)
    );
  }
}
