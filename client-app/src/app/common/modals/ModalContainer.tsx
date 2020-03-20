import React, { useContext } from 'react';
import { Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modalStore: {
      closeModal,
      modal: { IsOpen, body }
    }
  } = rootStore;

  return (
    <Modal open={IsOpen} onClose={closeModal} size="mini">
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
