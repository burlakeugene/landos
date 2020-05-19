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
            name: 'background',
            label: 'Background image',
            value: '',
          },
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            value: '',
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
