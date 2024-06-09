import React, { Fragment, useState } from "react";

const FileForm = ({ book, history, handleAddBook }) => {
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    handleAddBook(book, history, setUploadPercentage);
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Save"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </Fragment>
  );
};

const Progress = ({ percentage }) => {
  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped bg-success"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
};
export default FileForm;
