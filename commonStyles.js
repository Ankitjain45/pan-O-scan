import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#219bd930',
        color: '#ff0000'
    },
    errMsg: {
        fontSize: 18,
        fontWeight: '400',
        color: 'red',
    },
    header: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#219bd9',
    },
    logo: {
        width: 300,
        height: 200
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },

});

export default commonStyles;