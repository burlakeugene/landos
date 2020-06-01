export const getItemDefault = () => {
  return {
    title: 'New page',
    data: {
      sections: [],
      modals: [],
      forms: [],
      modules: [],
    },
  };
};

export const getSectionsStructure = (name) => {
  // name of each field in section must be uniq !!
  let data = {
      list: [
        {
          name: 'hero',
          title: 'Hero Image',
          fields: [
            {
              type: 'fields',
              width: 'seventh',
              fields: [
                {
                  type: 'file',
                  fileTypes: ['image/png', 'image/jpeg'],
                  name: 'background',
                  label: 'Background image',
                  value: '',
                  width: 'half',
                },
                {
                  type: 'fields',
                  width: 'half',
                  fields: [
                    {
                      type: 'text',
                      name: 'titleText',
                      label: 'Title',
                      value: '',
                    },
                    {
                      type: 'deliver',
                    },
                    {
                      type: 'switch',
                      label: 'Title text align',
                      name: 'titleAlign',
                      value: 'left',
                      options: [
                        {
                          value: 'left',
                          text: 'Left',
                        },
                        {
                          value: 'center',
                          text: 'Center',
                        },
                        {
                          value: 'right',
                          text: 'Right',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'deliver',
                },
                {
                  type: 'fields',
                  fields: [
                    {
                      type: 'text',
                      name: 'buttonText',
                      label: 'Button text',
                      value: '',
                      width: 'half',
                    },
                    {
                      type: 'select',
                      name: 'buttonType',
                      label: 'Button type',
                      width: 'half',
                      value: '',
                      options: [
                        {
                          value: 'link',
                          text: 'Link',
                        },
                        {
                          value: 'scroller',
                          text: 'Scroller',
                        },
                        {
                          value: 'modal',
                          text: 'Call modal',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      name: 'buttonLink',
                      value: '',
                      label: 'Button link',
                      width: 'half',
                      showConditions: [
                        {
                          target: 'buttonType',
                          type: 'equal',
                          value: 'link',
                        },
                      ],
                    },
                    {
                      type: 'bool',
                      name: 'bottonTargetBlank',
                      value: false,
                      text: 'Open in new tab',
                      label: ' ',
                      width: 'half',
                      showConditions: [
                        {
                          target: 'buttonType',
                          type: 'equal',
                          value: 'link',
                        },
                      ],
                    },
                    {
                      type: 'select',
                      options: 'sections',
                      name: 'buttonScrollTo',
                      value: '',
                      width: 'half',
                      showConditions: [
                        {
                          target: 'buttonType',
                          type: 'equal',
                          value: 'scroller',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'fields',
              width: 'third',
              fields: [
                {
                  type: 'textarea',
                  html: true,
                  name: 'descriptionText',
                  label: 'Content',
                  value: '',
                },
                {
                  type: 'deliver',
                },
                {
                  type: 'switch',
                  label: 'Content text align',
                  name: 'descriptionAlign',
                  value: 'left',
                  options: [
                    {
                      value: 'left',
                      text: 'Left',
                    },
                    {
                      value: 'center',
                      text: 'Center',
                    },
                    {
                      value: 'right',
                      text: 'Right',
                    },
                  ],
                },
              ],
            },
            {
              type: 'repeater',
              name: 'images',
              label: 'Fields',
              structure: {
                'alt': {
                  label: 'Alt',
                  type: 'text',
                  width: 'half'
                },
                'file': {
                  label: 'Image',
                  fileTypes: ['image/png', 'image/jpeg'],
                  type: 'file',
                  width: 'half'
                },
              },
              value: [],
            },
          ],
        },
      ],
      displayedList: ['hero'],
    },
    result = data;
  if (name) {
    if (result.displayedList.indexOf(name) >= 0) {
      result = result.list.find((section) => {
        return section.name === name;
      });
    } else {
      result = null;
    }
  }
  return result;
};
