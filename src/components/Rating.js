import React from 'react';
import '../index.css';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Rating = (props) => {
    const gradeOutOfTen = props.note / props.noteMaxi * 10;
    const gradeOutOfFive = (gradeOutOfTen / 2).toFixed(1);
    const fullStarsNumber = Math.floor(gradeOutOfFive);
    const halfStar = gradeOutOfFive - fullStarsNumber >= 0.5;
    const EmptyStarsNumber = 5 - fullStarsNumber - (halfStar ? 1 : 0);

    const fullStars = Array.from({ length: fullStarsNumber }, (_, index) => (
        <FontAwesomeIcon style={{ fontSize: "small" }} icon={faStar} key={"ep" + index} />
    ));

    const halfOfStar = halfStar ? <FontAwesomeIcon style={{ fontSize: "small" }} icon={faStarHalfAlt} key={"ed"} /> : null;

    const emptyStars = Array.from({ length: EmptyStarsNumber }, (_, index) => (
        <FontAwesomeIcon style={{ fontSize: "small" }} icon={farFaStar} key={"ev" + index} />
    ));

    return (
        <div className="rating">
            {fullStars}
            {halfOfStar}
            {emptyStars}
        </div>
    );
};

export default Rating;