import React, {Component} from 'react';
import {Text, TextInput, View, Button, StyleSheet} from 'react-native';

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: '',
        password: '',
      },
      loading: false,
      error: false,
    };
  }

  handleChange = (key, value) => {
    this.setState({
      data: {...this.state.data, [key]: value},
    });
  };

  handleSubmit = () => {
    let {data} = this.state;
    this.props.handleSubmit(data);
  };

  render() {
    const {data, error, loading} = this.state;

    return (
      <View>
        <Text style={styles.title}>Please login</Text>
        <TextInput
          style={styles.credentialsInput}
          placeholder="Username"
          value={data.username}
          onChangeText={value => this.handleChange('username', value)}
        />
        <TextInput
          style={styles.credentialsInput}
          placeholder="Password"
          value={data.password}
          secureTextEntry={true}
          onChangeText={value => this.handleChange('password', value)}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleSubmit} title="Submit" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 27,
  },
  buttonContainer: {
    marginTop: 10,
  },
  credentialsInput: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#c5c5c5',
  },
});
