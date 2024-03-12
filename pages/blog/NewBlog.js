export default function NewBlog({ postList }) {
    return (
        <ul>
            {!!postList &&
                postList.length > 5 &&
                postList.slice(0, 5).map((value, index) => {
                    return (
                        <li key={index}>
                            <a href={`/blog/${value?.postShortTitle}`} title={value.postTitle}>
                                {value.postTitle}
                            </a>
                        </li>
                    );
                })}
        </ul>
    );
}
