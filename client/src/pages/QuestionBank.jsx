import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuestionPage = () => {
    const { questionId } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`/api/questions/${questionId}`);
                setQuestion(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{question.title}</h1>
            <p>{question.body}</p>
            {/* Add more details about the question as needed */}
        </div>
    );
};

export default QuestionPage;