export const getItemStructure = () => {
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
            type: 'text',
            name: 'title',
            value: '',
          },
          {
            type: 'choose',
            name: 'titleAlign',
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
            value: 'center',
          },
          { type: 'color', name: 'titleColor', value: '#000' },
          { type: 'deliver' },
          {
            type: 'textarea',
            name: 'description',
            value: '',
          },
          {
            type: 'choose',
            name: 'descriptionAlign',
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
            value: 'center',
          },
          { type: 'color', name: 'descriptionColor', value: '#000' },
        ],
      },
      {
        name: 'hero2',
        title: 'Hero Image',
        fields: [
          {
            type: 'text',
            name: 'title',
            value: '',
          },
          {
            type: 'choose',
            name: 'titleAlign',
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
            value: 'center',
          },
          { type: 'color', name: 'titleColor', value: '#000' },
          { type: 'deliver' },
          {
            type: 'textarea',
            name: 'description',
            value: '',
          },
          {
            type: 'choose',
            name: 'descriptionAlign',
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
            value: 'center',
          },
          { type: 'color', name: 'descriptionColor', value: '#000' },
        ],
      },
    ],
    displayedList: ['hero', 'hero2'],
  };
};
