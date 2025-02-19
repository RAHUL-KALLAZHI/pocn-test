import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS ,APOLLO_NAMED_OPTIONS} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache,ApolloLink } from '@apollo/client/core';
import { BrowserModule } from '@angular/platform-browser';
import { setContext } from '@apollo/client/link/context';
import { environment } from 'src/environments/environment';

export function createDefaultApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: environment.graphqlAnonymous }),  // HERE WE WILL PUT OUR GRAPHQL URL
    cache: new InMemoryCache(),
  };
}
const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
}));
  const auth = setContext((operation, context) => {
const token = localStorage.getItem('pocnApiAccessToken');

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
      'auth-strategy': "next",
      'realm': "POCN",
      Authorization: `Bearer ${token}`
    }
      };
    }
  });


export function createNamedApollo(httpLink: HttpLink) {
    return {
        second: {
        name: 'second',
            link: ApolloLink.from([basic, auth,httpLink.create({ uri: environment.graphqlShielded })]),
            cache: new InMemoryCache(),
            fetchPolicy: 'network-only',
          // fetchPolicy: 'cache-and-network',
            // nextFetchPolicy: 'cache-and-network',
        }
    };
}


@NgModule({
  imports: [BrowserModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createDefaultApollo,
      deps: [HttpLink],
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      deps: [HttpLink],
      useFactory: createNamedApollo
    }
  ]
})
export class GraphQLModule {}
