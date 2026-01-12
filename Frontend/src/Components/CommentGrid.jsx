import React from 'react';
import SendButton from "../Components/SendButton";
import CommentItem from './CommentItem';

const CommentGrid = ({ comments, setComment, onSend, commentText }) => {
    return (
        <div>
            <div className="input-comment" style={
                {
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "16px",


                }}>
                <input placeholder="Type your comment here" style={{
                    backgroundColor: "#f0faf4", width: "500px",
                    height: "40px", fontSize: "18px", borderRadius: "15px", color: "#000", padding: "0 15px"
                }}
                    onChange={(e) => { setComment(e.target.value) }} value={commentText}></input>

                {commentText.length > 0 && <SendButton onClick={onSend} input={commentText} />}
            </div>


            {comments.length > 0 &&
                <div className="comments" style=
                    {{
                        maxWidth: "600px",
                        maxHeight: "400px",
                        overflowY: "scroll",
                        border: "2px solid #ccc",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "5px",
                        padding: "16px",
                        backgroundColor: "#e0e7ff",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}>





                    {comments.map((item, index) => {

                        return (
                            <CommentItem Name={item.userName} comment={item.commentText} userAvatar={item.userAvatar} date={item.createdDate} uId={item.userId} />

                        )

                    })}


                </div>
            }


        </div>


    );
}

export default CommentGrid;
