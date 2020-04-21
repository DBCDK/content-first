import React from 'react';
import Link from '../../general/Link.component';
import T from '../../base/T';

const Origin = ({componentData, work = {}}) => {
  switch (componentData.type) {
    case 'searchTags':
      return (
        <Link
          style={{color: 'var(--petroleum)'}}
          href={'/find?tags=' + componentData.tags}
          className="origin_link"
        >
          <T component="shortlist" name="originLink" />
        </Link>
      );

    case 'minderOm':
      return (
        <Link
          style={{color: 'var(--petroleum)'}}
          href={'/værk/' + componentData.minderLink[0]}
          className="origin_link"
        >
          <T component="shortlist" name="minderOmLink" />
          {componentData.minderLink[1]}
        </Link>
      );

    case 'personalList':
      return (
        <Link
          style={{color: 'var(--petroleum)'}}
          href={'/lister/' + componentData.listLink[0]}
          className="origin_link"
        >
          <T component="shortlist" name="fromListLink" />
          {componentData.listLink[1]}
        </Link>
      );
    case 'series':
      return (
        <span>
          <T
            component="shortlist"
            name="seriesLabel"
            vars={[work.part, componentData.titleSeries]}
          />
        </span>
      );
    default:
      return <React.Fragment>{componentData}</React.Fragment>;
  }
};

export default Origin;
