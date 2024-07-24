import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Space } from 'antd';

const ProductComments = ({ productId }) => {
    const [productComments, setProductComments] = useState([]);
    const [showComments, setShowComments] = useState(true); // State to toggle between comments and ratings

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/product_comments`);
                const comments = response.data;

                // Filter comments for the specific productId
                const filteredComments = comments.filter(comment => comment.productId === productId);

                // Add usernames to comments
                const commentsWithUsernames = await Promise.all(filteredComments.map(async (comment) => {
                    const userResponse = await axios.get(`http://localhost:3000/api/users`);
                    const user = userResponse.data;
                    return {
                        ...comment,
                        username: user.username // Assuming your API returns the username along with the comment
                    };
                }));

                setProductComments(commentsWithUsernames);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [productId]);

    // Calculate average rating
    const calculateAverageRating = () => {
        if (productComments.length === 0) return 0;

        const totalRating = productComments.reduce((sum, comment) => sum + comment.rating, 0);
        return (totalRating / productComments.length).toFixed(1);
    };

    return (
        <div>
            <br></br>
            <Space>
                <Button type={showComments ? "primary" : "default"} onClick={() => setShowComments(true)}>
                    Ürün Yorumları Göster
                </Button>
                <Button type={!showComments ? "primary" : "default"} onClick={() => setShowComments(false)}>
                    Ürün Puanlaması Göster
                </Button>
            </Space>
            <h2>Ürün {showComments ? 'Yorumları' : 'Puanı'}</h2>

            {showComments ? (
                <>
                    {productComments.length > 0 ? (
                        productComments.map(comment => (
                            <div key={comment.id}>
                                <p><strong>{comment.username}</strong> ({comment.rating} yıldız): {comment.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>Bu ürün hakkında henüz yorum yapılmamış.</p>
                    )}
                </>
            ) : (
                <p>Ortalama Yıldız Puanı: {calculateAverageRating()}</p>
            )}
        </div>
    );
};

export default ProductComments;
