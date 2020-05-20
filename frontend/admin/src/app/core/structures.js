export const getItemDefault = () => {
  return {
    title: 'New page',
    data: {
      sections: [],
    },
  };
};

export const getSectionsStructure = () => {
  return {
    list: [
      {
        name: 'hero',
        title: 'Hero Image',
        fields: [
          {
            type: 'file',
            fileTypes: ['image/png', 'image/jpeg'],
            name: 'background',
            label: 'Background image',
            value: '',
            width: 'third',
            maxWidth: 150
          },
          {
            type: 'fields',
            width: 'third',
            fields: [
              {
                type: 'text',
                name: 'title',
                label: 'Title',
                value: '',
              },
              {
                type: 'deliver'
              },
              {
                type: 'switch',
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
          { type: 'deliver' },
          {
            type: 'textarea',
            name: 'description',
            value: '',
          },
          {
            type: 'switch',
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
    ],
    displayedList: ['hero'],
  };
};
