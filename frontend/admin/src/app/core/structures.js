export const getItemDefault = () => {
  return {
    title: 'New page',
    data: {
      sections: [],
      modals: [],
      forms: []
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
            type: 'fields',
            width: 'third',
            fields: [
              {
                type: 'textarea',
                html: true,
                name: 'description',
                label: 'Content',
                value: '',
              },
              {
                type: 'deliver'
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
          }
        ],
      }
    ],
    displayedList: ['hero'],
  };
};
