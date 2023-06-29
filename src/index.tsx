import {
  Module,
  customModule,
  Styles,
  Panel,
  ControlElement,
  customElements,
  Container,
  IDataSchema,
  moment
} from '@ijstech/components';
import { IConfig, IPageBlockAction } from './interface';
import { cardItemStyle, cardStyle, imageStyle, avatarStyle, containerStyle } from './index.css';
import dataJson from './data.json';

const Theme = Styles.Theme.currentTheme;
// const configSchema = {
//   type: 'object',
//   required: [],
//   properties: {
//     titleFontColor: {
//       type: 'string',
//       format: 'color',
//     },
//     descriptionFontColor: {
//       type: 'string',
//       format: 'color',
//     },
//     linkTextColor: {
//       type: 'string',
//       format: 'color',
//     },
//     dateColor: {
//       type: 'string',
//       format: 'color',
//     },
//     userNameColor: {
//       type: 'string',
//       format: 'color',
//     },
//     backgroundColor: {
//       type: 'string',
//       format: 'color',
//     }
//   }
// }

const propertiesSchema: IDataSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    linkUrl: {
      type: 'string'
    },
    isExternal: {
      type: 'boolean'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    backgroundImage: {
      type: 'string'
    },
    userName: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    }
  }
};

const defaultColors = {
  dateColor: '#565656',
  userNameColor: '#565656',
  backgroundColor: '#fff'
}

interface ScomBlogElement extends ControlElement {
  lazyLoad?: boolean;
  data?: IConfig;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-blog']: ScomBlogElement;
    }
  }
}

@customModule
@customElements('i-scom-blog')
export default class Blog extends Module {
  private pnlCardBody: Panel;
  private _data: IConfig = {
    title: '',
    backgroundImage: ''
  };
  tag: any = {};
  defaultEdit: boolean = true;
  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  static async create(options?: ScomBlogElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: ScomBlogElement) {
    super(parent, options);
  }

  init() {
    super.init();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const data = this.getAttribute('data', true);
      if (data) this.setData(data);
      this.setTag({
        titleFontColor: defaultColors.dateColor,
        descriptionFontColor: defaultColors.dateColor,
        linkTextColor: Theme.colors.primary.main,
        dateColor: defaultColors.dateColor,
        userNameColor: defaultColors.userNameColor,
        backgroundColor: defaultColors.backgroundColor
      });
    }
  }

  private getData() {
    return this._data;
  }

  private async setData(data: IConfig) {
    this._data = data
    this.onUpdateBlock(this.tag);
  }

  private getTag() {
    return this.tag;
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        this.tag[prop] = newValue[prop];
      }
    }
    this.onUpdateBlock(this.tag);
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions: IPageBlockAction[] = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let _oldData: IConfig = {
            title: '',
            backgroundImage: ''
          };
          return {
            execute: async () => {
              _oldData = {...this._data};
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              this._data = {..._oldData};
              if (builder?.setData) builder.setData(_oldData);
              this.setData(_oldData);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = {...this.tag};
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = {...oldTag};
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ];
    return actions;
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          const themeSchema: IDataSchema = {
            type: 'object',
            properties: {
              titleFontColor: {
                type: 'string',
                format: 'color',
              },
              descriptionFontColor: {
                type: 'string',
                format: 'color',
              },
              linkTextColor: {
                type: 'string',
                format: 'color',
              },
              dateColor: {
                type: 'string',
                format: 'color',
              },
              userNameColor: {
                type: 'string',
                format: 'color',
              },
              backgroundColor: {
                type: 'string',
                format: 'color',
              }
            }
          };
          return this._getActions(propertiesSchema, themeSchema);
        },
        getData: this.getData.bind(this),
        setData: async (data: IConfig) => {
          const defaultData = dataJson.defaultBuilderData as any;
          await this.setData({...defaultData, ...data})
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private onUpdateBlock(config: any) {
    const {
      titleFontColor = defaultColors.dateColor,
      descriptionFontColor = defaultColors.dateColor,
      linkTextColor = Theme.colors.primary.main,
      dateColor = defaultColors.dateColor,
      userNameColor = defaultColors.userNameColor,
      backgroundColor = defaultColors.backgroundColor
    } = config || {};
    this.pnlCardBody.clearInnerHTML();
    this.pnlCardBody.appendChild(
      <i-grid-layout
        width="100%"
        height="100%"
        class={cardItemStyle}
        border={{ radius: 5, width: 1, style: 'solid', color: 'rgba(217,225,232,.38)' }}
        templateAreas={
          [
            ["areaImg"], ["areaDate"], ["areaDetails"]
          ]
        }
        overflow="hidden"
        onClick={() => this.openLink()}
      >
        <i-panel overflow={{x: 'hidden', y: 'hidden'}} position="relative" padding={{top: '56.25%'}}>
          <i-image
            class={imageStyle}
            width='100%'
            height="100%"
            grid={{ area: "areaImg" }}
            url={this._data.backgroundImage}
            position="absolute" left="0px" top="0px"
          ></i-image>
        </i-panel>
        <i-panel padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }} background={{ color: backgroundColor || defaultColors.backgroundColor }}>
          <i-hstack grid={{ area: "areaDate" }} verticalAlignment="center" gap="0.938rem" margin={{bottom: '0.75rem'}}>
            <i-panel width={50} height={50} visible={!!this._data.avatar}>
              <i-image width="100%" height="100%" url={this._data.avatar} display="block" class={avatarStyle}></i-image>
            </i-panel>
            <i-vstack verticalAlignment="center" gap="0.25rem">
              <i-label
                id="dateLb"
                visible={!!this._data.date}
                caption={this.formatDate(this._data.date)}
                font={{ size: '0.8125rem', color: dateColor || defaultColors.dateColor }}
              ></i-label>
              <i-label
                id="usernameLb"
                visible={!!this._data.userName}
                caption={this._data.userName}
                font={{ size: '0.8125rem', color: userNameColor || defaultColors.userNameColor }}
              ></i-label>
            </i-vstack>
          </i-hstack>
          <i-vstack grid={{ area: "areaDetails" }} verticalAlignment="center" gap="0.5rem" padding={{ bottom: '1rem' }}>
            <i-label id="titleLb" caption={this._data.title} font={{ weight: 700, size: '1.375rem', color: titleFontColor || defaultColors.dateColor }}></i-label>
            <i-label id="descriptionLb" caption={this._data.description} font={{ size: '0.875rem', color: descriptionFontColor || defaultColors.dateColor }}></i-label>
            <i-label
              id="linkLb"
              caption="Read More"
              link={{ href: this._data.linkUrl, target: this._data.isExternal ? "_blank" :  "_self" }}
              font={{ weight: 700, size: '0.875rem', color: linkTextColor || defaultColors.dateColor }}
            ></i-label>
          </i-vstack>
        </i-panel>
      </i-grid-layout>
    )
  }

  private formatDate(date: any) {
    if (!date) return '';
    return moment(date, "DD/MM/YYYY").format('MMMM DD, YYYY');
  }

  private openLink() {
    if (!this._data.linkUrl) return;
    if (this._data.isExternal)
      window.open(this._data.linkUrl);
    else
      window.location.href = this._data.linkUrl;
  }

  render() {
    return (
      <i-panel id="pnlBlock" class={cardStyle}>
        <i-panel id="pnlCard">
          <i-panel class={containerStyle}>
            <i-panel id="pnlCardBody" minHeight={48}></i-panel>
          </i-panel>
        </i-panel>
      </i-panel>
    )
  }
}