import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React from 'react';

function getBase64(file: Blob | File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

interface Props {
  uploadBtnVisible: boolean;
  fileList?: UploadFile[];
  onChange?: (info: UploadChangeParam) => void;
}

interface State {
  previewVisible: boolean;
  previewImage?: string;
  previewTitle?: string;
}

class PicturesWall extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      // fileList: [
      //   {
      //     uid: '-1',
      //     name: 'image.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   } as UploadFile,
      //   {
      //     uid: '-2',
      //     name: 'image.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   } as UploadFile,
      //   {
      //     uid: '-3',
      //     name: 'image.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   } as UploadFile,
      //   {
      //     uid: '-4',
      //     name: 'image.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   } as UploadFile,
      //   {
      //     uid: '-xxx',
      //     percent: 50,
      //     name: 'image.png',
      //     status: 'uploading',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   } as UploadFile,
      //   {
      //     uid: '-5',
      //     name: 'image.png',
      //     status: 'error',
      //   } as UploadFile,
      // ],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: UploadFile) => {
    const filePreview =
      !file.url && !file.preview && file.originFileObj ? await getBase64(file.originFileObj) : undefined;

    this.setState({
      previewImage: file.url || filePreview,
      previewVisible: true,
      previewTitle: file.name || file.url?.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  render() {
    const { previewVisible, previewImage, previewTitle } = this.state;
    const { onChange, fileList } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>อัพโหลด</div>
      </div>
    );
    return (
      <>
        <Upload
          name="files"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          multiple
          onPreview={this.handlePreview}
          onChange={onChange}
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;
