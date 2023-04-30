import { Button, Container, Flex, Group, Title } from '@mantine/core';
import { Table } from '@tanstack/react-table';
import { Document } from 'store/api/document/types';
import {
  CreateDoc,
  OpenDoc,
  DeleteDoc,
  OcrDoc,
  ExportDoc,
  FilterDoc,
} from './Buttons';
import { useLogoutMutation } from 'store/api/auth';
import { ReactComponent as Logout } from '../../assets/SVG/Logout.svg';
import { useTypedDispatch, useTypedSelector } from 'store/ReduxHooks';
import { logoutRefreshInStore } from 'store/slices/authSlice';
import { setIsOpenedMenu } from 'store/slices/menu';
import { selectCurrentDirectoryId } from 'store/slices/currentDirectory';
import { ManualSelection } from './Buttons/ManualSelection';

interface FileTableContainerProps {
  children: React.ReactNode;
  table: Table<Document>;
  selectedId: number | null;
  currentDocument: Document | undefined;
}

export const FileTableContainer: React.FC<FileTableContainerProps> = ({
  children,
  table,
  selectedId,
  currentDocument,
}) => {
  const dispatch = useTypedDispatch();
  const currentDirectoryId = useTypedSelector(selectCurrentDirectoryId);
  const [logout] = useLogoutMutation();

  const logoutFromAccount = async () => {
    dispatch(logoutRefreshInStore());
    dispatch(setIsOpenedMenu(false));
    localStorage.removeItem('refresh_token');
    await logout();
  };

  return (
    <Flex
      direction="column"
      sx={{
        marginLeft: '38px',
        marginTop: '20px',
        overflowX: 'hidden',
        zIndex: 3,
        width: '100%',
        maxHeight: '90vh',
      }}
    >
      <Container fluid={true} mx={0} sx={{ paddingLeft: '0' }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Title sx={{ fontWeight: 500, fontSize: 30 }} order={2} mb="16.25px">
            Мои документы
          </Title>
          <Button
            variant="filled"
            leftIcon={<Logout />}
            mr="20px"
            sx={{ borderRadius: '8px', fontWeight: 500, fontSize: 16 }}
            onClick={logoutFromAccount}
          >
            Выйти
          </Button>
        </Flex>
        <Flex mb="17px" sx={{ justifyContent: 'space-between' }}>
          <Group sx={{ position: 'relative', gap: '6px' }}>
            <OcrDoc disabled={!currentDirectoryId} />
            <ManualSelection disabled={!currentDirectoryId} />
            <CreateDoc disabled={!currentDirectoryId} />
            <OpenDoc
              disabled={!currentDirectoryId}
              selectedId={selectedId}
              currentDocument={currentDocument}
            />
            <DeleteDoc disabled={!currentDirectoryId} selectedId={selectedId} />
            <ExportDoc disabled={!currentDirectoryId} selectedId={selectedId} />
          </Group>
          <FilterDoc table={table} />
        </Flex>
      </Container>
      <Container
        h="90vh"
        fluid={true}
        mx={0}
        sx={{
          overflowX: 'auto',
          paddingLeft: '0',
        }}
      >
        {children}
      </Container>
    </Flex>
  );
};
