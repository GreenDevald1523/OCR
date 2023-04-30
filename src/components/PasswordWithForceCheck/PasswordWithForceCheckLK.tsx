import { PasswordInput, Popover, Progress } from '@mantine/core';
import { useState, ChangeEvent } from 'react';
import { PasswordRequirement } from '../PasswordRequirement/PasswordRequirement';
import { IconEye, IconEyeOff } from '@tabler/icons';

const requirements = [
  { re: /[0-9]/, label: 'Содержит число' },
  { re: /[a-zа-я]/, label: 'Содержит строчную букву' },
  { re: /[A-ZА-Я]/, label: 'Содержит заглавную букву' },
];

interface PasswordCutomProps {
  error: string;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  value: string;
}

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export const PasswordWithForceCheckLK = (props: PasswordCutomProps) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(props.value)}
    />
  ));

  const strength = getStrength(props.value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <div>
      <Popover
        transition="pop"
        styles={{
          dropdown: {
            paddingTop: 15,
            paddingLeft: 20,
            paddingRight: 20,
          },
        }}
        radius={20}
        opened={popoverOpened}
        position="bottom"
        width="target"
      >
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              label="НОВЫЙ ПАРОЛЬ"
              placeholder="Введите пароль..."
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <IconEye color="black" />
                ) : (
                  <IconEyeOff color="black" />
                )
              }
              {...props}
              styles={{
                label: {
                  fontSize: 15,
                  marginLeft: 0,
                  fontWeight: 500,
                },
              }}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress
            color={color}
            value={strength}
            size={10}
            style={{ marginBottom: 10 }}
          />
          <PasswordRequirement
            label="Содержит минимум 6 знаков"
            meets={props.value.length > 5}
          />
          {checks}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};
