import type { MantineThemeOverride } from '@mantine/core';

// export your theme object
export const CustomTheme: MantineThemeOverride = {
  primaryColor: 'indigo',
  black: '#1E1E1E',
  fontFamily: 'Euclid Circular A !important',
  globalStyles: (theme) => ({
    body: {
      overflow: 'hidden',
    },
    '*, *::before, *::after': {
      listStyle: 'none',
      MozWindowDragging: 'no-drag',
    },
    ul: {
      paddingInlineStart: '15px',
    },
    '*::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.indigo[4],
      border: '1px solid white',
      borderRadius: '3px',
    },
    '*::-webkit-scrollbar': {
      height: '8px',
      width: '8px',
    },
  }),
  components: {
    Input: {
      styles: (theme) => ({
        input: {
          background: `${theme.colors.gray[0]} !important`,
        },
        placeholder: {
          color: '#1E1E1E1 !important',
        },
      }),
    },
    Modal: {
      styles: {
        modal: {
          borderRadius: '13px',
        },
        title: {
          fontWeight: 500,
          fontSize: '20px',
        },
      },
      defaultProps: {
        closeOnClickOutside: false,
      },
    },

    Group: {
      styles: () => ({
        '&:hover': {
          backgroundColor: '#F8F9FA !important',
        },
      }),
    },
    Text: {
      styles: () => ({
        root: {
          border: 'none',
        },
      }),
    },
    Notification: {
      styles: () => ({
        root: {
          '&::before': { left: 8, top: 8, bottom: 8 },
          borderRadius: 14,
          minHeight: 70,
        },
        title: {
          fontSize: 18,
        },
        description: {
          fontSize: 16,
        },
      }),
    },
    TimeInput: {
      styles: (theme) => ({
        input: {
          fontSize: 16,
          height: 46,
          borderRadius: 11,
          backgroundColor: '#F8F8F8',
          borderColor: theme.colors.gray[4],
          borderWidth: 2,
          ['&:disabled']: {
            color: '#000',
          },
          '&:focus': {
            borderColor: '#4C6EF5',
            backgroundColor: '#fff',
          },
        },
        timeInput: {
          fontSize: 16,
        },
        controls: {
          height: 42,
        },
        error: {
          fontSize: 15,
          marginTop: 6,
          marginLeft: 10,
        },
      }),
    },
    DatePicker: {
      styles: (theme) => ({
        input: {
          fontSize: 16,
          height: 46,
          borderRadius: 11,
          backgroundColor: '#F8F8F8',
          borderColor: theme.colors.gray[4],
          borderWidth: 2,
          ['&:disabled']: {
            color: '#000',
          },

          '&:focus': {
            borderColor: '#4C6EF5',
            backgroundColor: '#fff',
          },
        },
        error: {
          fontSize: 15,
          marginTop: 6,
          marginLeft: 10,
        },
      }),
    },
    TextInput: {
      styles: (theme) => ({
        label: {
          fontSize: 21,
          marginLeft: 10,
          marginBottom: 6,
        },
        input: {
          fontSize: 18,
          height: 46,
          borderRadius: 11,
          backgroundColor: '#F8F8F8',
          borderColor: theme.colors.gray[4],
          borderWidth: 2,
          ['&:disabled']: {
            color: '#000',
          },

          '&:focus': {
            borderColor: '#4C6EF5',
            backgroundColor: '#fff',
          },
        },
        error: {
          fontSize: 15,
          marginTop: 6,
          marginLeft: 10,
        },
      }),
    },
    NumberInput: {
      styles: (theme) => ({
        label: {
          fontSize: 21,
          marginLeft: 10,
          marginBottom: 6,
        },
        input: {
          fontSize: 18,
          height: 46,
          borderRadius: 11,
          backgroundColor: '#F8F8F8',
          borderColor: theme.colors.gray[4],
          borderWidth: 2,
          ['&:disabled']: {
            color: '#000',
          },

          '&:focus': {
            borderColor: '#4C6EF5',
            backgroundColor: '#fff',
          },
        },
        error: {
          fontSize: 15,
          marginTop: 6,
          marginLeft: 10,
        },
      }),
    },
    PasswordInput: {
      styles: (theme) => ({
        label: {
          fontSize: 21,
          marginLeft: 10,
          marginBottom: 6,
        },
        input: {
          fontSize: 18,
          height: 46,
          borderRadius: 11,
          backgroundColor: '#F8F8F8',
          borderColor: theme.colors.gray[4],
          borderWidth: 2,
          ['&:disabled']: {
            color: '#000',
          },

          '&:focus': {
            borderColor: '#4C6EF5',
          },
        },
        rightSection: {
          paddingRight: 30,
        },
        innerInput: {
          height: 46,
          padding: '0px 15px',
          fontSize: 18,
        },
        error: {
          fontSize: 15,
          marginTop: 6,
          marginLeft: 10,
        },
      }),
    },
  },
};
