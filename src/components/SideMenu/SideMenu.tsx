import { FC, useState } from 'react';
import { FilesTree } from '../FilesTree/index';
import { IconFiles, IconSettings } from '@tabler/icons';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import {
  selectIsOpened,
  toggleIsOpenedMenu,
  setIsOpenedMenu,
} from 'store/slices/menu';
import {
  Collapse,
  Button,
  Stack,
  Text,
  ColorSwatch,
  useMantineTheme,
  Flex,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { motion } from 'framer-motion';
import { ReactComponent as Arrow } from '../../assets/SVG/Arrow.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetClientUserQuery } from 'store/api/user/userApi';
import { Profile } from '../FilesTable/Modals/Profile/Profile';
import { useUsers } from 'hooks/useUsers';
import { UserProfileAvatar } from '../UserProfileAvatar/UserProfileAvatar';

export const SideMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ClientUser = useGetClientUserQuery();

  const dispatch = useTypedDispatch();
  const isOpenedMenu = useTypedSelector(selectIsOpened);
  const currentUser = useUsers().currentUser;

  const [isOpenedMyDocs, setIsOpenedMyDocs] = useState<boolean>(false);
  const [memorizedMyDocs, setMemorizedMyDocs] = useState<boolean>(false);

  const paddingSizes = isOpenedMenu ? '16px' : '0';
  const positionButton = isOpenedMenu ? 'start' : 'center';
  const borderRadius = isOpenedMenu ? '4px' : '0';

  const themes = useMantineTheme();

  const buttonMotion = {
    open: { display: 'block', x: 0 },
    closed: { display: 'none', x: '-10px' },
  };

  const menuMotion = {
    open: { width: '410px', flex: '0 0 410px' },
    closed: { width: '80px', flex: '0 0 80px' },
  };

  return (
    <motion.div
      initial={'closed'}
      animate={isOpenedMenu ? 'open' : 'closed'}
      variants={menuMotion}
      transition={{ type: 'tween' }}
      style={{
        position: 'relative',
      }}
    >
      <ColorSwatch
        component="button"
        color={themes.colors.indigo[6]}
        onClick={() => {
          dispatch(toggleIsOpenedMenu());
          if (isOpenedMenu) {
            setMemorizedMyDocs(isOpenedMyDocs);
            setIsOpenedMyDocs(false);
          } else {
            setIsOpenedMyDocs(memorizedMyDocs);
          }
        }}
        sx={{
          cursor: 'pointer',
          position: 'absolute',
          zIndex: 100,
          top: 25,
          right: -13,
        }}
      >
        {isOpenedMenu ? (
          <Arrow width={10} />
        ) : (
          <Arrow transform="rotate(180)" width={10} />
        )}
      </ColorSwatch>
      <Flex
        direction="column"
        align="center"
        h="93vh"
        sx={{
          borderRight: '1px solid #D3D3D3',
          padding: `20px ${paddingSizes} 0`,
          position: 'relative',
          zIndex: 1,
          overflowX: 'hidden',
        }}
      >
        <Stack
          sx={{
            overflow: 'hidden',
            width: '100%',
            marginBottom: 7,
            marginRight: `${isOpenedMenu ? '15px' : '0'}`,
          }}
        >
          <Button
            onClick={() => {
              openModal({
                modalId: 'Profile',
                centered: true,
                children: <Profile />,
              });
            }}
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: theme.fn.rgba(theme.colors.indigo[6], 0.15),
              },
              background: 'none',
              height: 70,
              padding: '0 19px 0 19px',
              justifyContent: `${positionButton}`,
              display: 'flex',
              borderRadius: `${borderRadius}`,
              transition: '0s',
            })}
          >
            <UserProfileAvatar displayname={currentUser?.displayname} />
            <motion.div
              animate={isOpenedMenu ? 'open' : 'closed'}
              variants={buttonMotion}
            >
              <Text
                sx={{
                  color: 'black',
                  fontWeight: 500,
                  fontSize: 20,
                  marginLeft: 10,
                }}
              >
                {currentUser?.displayname}
              </Text>
            </motion.div>
          </Button>
        </Stack>
        <Stack sx={{ overflow: 'hidden', width: '100%', gap: '5px' }}>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              if (location.pathname !== '/home') navigate('/home');

              // Если меню и дерево не открыты - открываем древо
              if (!(isOpenedMyDocs && isOpenedMenu)) {
                setIsOpenedMyDocs((o) => !o);
              } else if (e.detail === 2) {
                // Если же они уже открыты - то закрываем древо только при двойном клике
                setIsOpenedMyDocs((o) => !o);
              }
              dispatch(setIsOpenedMenu(isOpenedMenu));
              if (!isOpenedMenu) {
                dispatch(toggleIsOpenedMenu());
                return;
              }
            }}
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: theme.fn.rgba(theme.colors.indigo[6], 0.15),
              },
              background: 'none',
              padding: '0 19px 0 19px',
              justifyContent: `${positionButton}`,
              display: 'flex',
              borderRadius: `${borderRadius}`,
              transition: '0s',
            })}
          >
            <IconFiles size={30} strokeWidth={2} color="black" />
            <motion.div
              animate={isOpenedMenu ? 'open' : 'closed'}
              variants={buttonMotion}
            >
              <Text
                sx={{
                  color: 'black',
                  fontWeight: 500,
                  fontSize: 20,
                  marginLeft: '6px',
                }}
              >
                Мои документы
              </Text>
            </motion.div>
          </Button>
          <Collapse in={isOpenedMyDocs}>
            <FilesTree />
          </Collapse>
        </Stack>

        {ClientUser.data && ClientUser.data.superuser && (
          <Button
            w="100%"
            onClick={() => {
              dispatch(setIsOpenedMenu(isOpenedMenu));
              if (location.pathname !== '/access_rights')
                navigate('/access_rights');
              if (!isOpenedMenu) {
                dispatch(toggleIsOpenedMenu());
                return;
              }
            }}
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: theme.fn.rgba(theme.colors.indigo[6], 0.15),
              },
              background: 'none',
              padding: '0 19px 0 19px',
              justifyContent: `${positionButton}`,
              display: 'flex',
              borderRadius: `${borderRadius}`,
              transition: '0s',
            })}
          >
            <IconSettings size={30} strokeWidth={2} color="black" />
            <motion.div
              animate={isOpenedMenu ? 'open' : 'closed'}
              variants={buttonMotion}
            >
              <Text
                sx={{
                  color: 'black',
                  fontWeight: 500,
                  fontSize: 20,
                  marginLeft: '6px',
                }}
              >
                Права доступа
              </Text>
            </motion.div>
          </Button>
        )}
      </Flex>
    </motion.div>
  );
};
